<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace mod_smarturl\local\policy;

/**
 * Evaluates and updates external field-lock policies and local override watermarks.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class policy_manager {
    /** @var string[] Supported lockable field groups. */
    public const LOCKABLE_FIELDS = ['general', 'externalurl', 'display', 'completion', 'availability', 'metadata', 'removable'];

    /**
     * Reads the policy row for a course module ID, if any.
     *
     * @param int $cmid Course module ID.
     * @return \stdClass|null
     */
    public static function get_by_cmid(int $cmid): ?\stdClass {
        global $DB;
        $rec = $DB->get_record('smarturl_policy', ['cmid' => $cmid]);
        return $rec ?: null;
    }

    /**
     * Reads the policy row for a Smart URL instance ID, if any.
     *
     * @param int $smarturlid Instance ID.
     * @return \stdClass|null
     */
    public static function get_by_smarturlid(int $smarturlid): ?\stdClass {
        global $DB;
        $rec = $DB->get_record('smarturl_policy', ['smarturlid' => $smarturlid]);
        return $rec ?: null;
    }

    /**
     * Decodes normalized locked field keys from a policy record.
     *
     * @param \stdClass|null $policy Policy record.
     * @return string[]
     */
    public static function locked_fields(?\stdClass $policy): array {
        if (!$policy || empty($policy->locked_fields_json)) {
            return [];
        }
        $decoded = json_decode((string)$policy->locked_fields_json, true);
        if (!is_array($decoded)) {
            return [];
        }
        return array_values(array_intersect(self::LOCKABLE_FIELDS, array_map('strtolower', array_map('strval', $decoded))));
    }

    /**
     * Checks whether a user can edit a given field group on a Smart URL module.
     *
     * @param string $field Field group (`general`, `externalurl`, `display`, `completion`, `availability`, `metadata`).
     * @param \stdClass|null $policy Policy record.
     * @param \context $context Module or course context.
     * @param int $userid User ID.
     * @return bool
     */
    public static function can_edit_field(string $field, ?\stdClass $policy, \context $context, int $userid): bool {
        $capmap = [
            'general' => 'mod/smarturl:editgeneral',
            'externalurl' => 'mod/smarturl:editurl',
            'display' => 'mod/smarturl:editdisplay',
            'completion' => 'mod/smarturl:editcompletion',
            'availability' => 'mod/smarturl:editavailability',
            'metadata' => 'mod/smarturl:editmetadata',
        ];
        $cap = $capmap[$field] ?? null;
        if ($cap && !has_capability($cap, $context, $userid)) {
            return false;
        }
        if ($policy !== null && in_array($field, self::locked_fields($policy), true)) {
            return has_capability('mod/smarturl:bypasspolicy', $context, $userid);
        }
        return true;
    }

    /**
     * Upserts policy metadata when pushed from an external web service.
     *
     * @param int $smarturlid Instance ID.
     * @param int $cmid Course module ID.
     * @param array<string, mixed> $input Policy attributes.
     * @return \stdClass Saved policy record.
     */
    public static function upsert_external(int $smarturlid, int $cmid, array $input): \stdClass {
        global $DB;

        $existing = self::get_by_smarturlid($smarturlid);
        $locked = [];
        if (isset($input['lockedfields']) && is_array($input['lockedfields'])) {
            $locked = array_values(array_intersect(
                self::LOCKABLE_FIELDS,
                array_map('strtolower', array_map('strval', $input['lockedfields']))
            ));
        } else if ($existing) {
            $locked = self::locked_fields($existing);
        }

        $now = time();
        $record = (object)[
            'smarturlid' => $smarturlid,
            'cmid' => $cmid,
            'managed_by' => array_key_exists('managedby', $input)
                ? ($input['managedby'] ?: null)
                : ($existing->managed_by ?? null),
            'external_key' => array_key_exists('externalkey', $input)
                ? ($input['externalkey'] ?: null)
                : ($existing->external_key ?? null),
            'mandatory' => array_key_exists('mandatory', $input)
                ? (int)!empty($input['mandatory'])
                : (int)($existing->mandatory ?? 0),
            'locked_fields_json' => json_encode($locked),
            'managed_availability_json' => array_key_exists('managedavailability', $input)
                ? ($input['managedavailability'] ?: null)
                : ($existing->managed_availability_json ?? null),
            'custom_availability_json' => array_key_exists('customavailability', $input)
                ? ($input['customavailability'] ?: null)
                : ($existing->custom_availability_json ?? null),
            'local_revision' => $existing ? (int)$existing->local_revision : 0,
            'acked_revision' => array_key_exists('ackedrevision', $input)
                ? (int)$input['ackedrevision']
                : ($existing ? (int)$existing->acked_revision : 0),
            'last_modified_by' => $existing->last_modified_by ?? null,
            'timemodified' => $now,
        ];

        // When external sync acknowledges current state, keep local_revision aligned when requested.
        if (!empty($input['syncacknowledges'])) {
            $record->acked_revision = max($record->acked_revision, $record->local_revision);
        }

        if ($existing) {
            $record->id = $existing->id;
            $DB->update_record('smarturl_policy', $record);
        } else {
            $record->id = $DB->insert_record('smarturl_policy', $record);
        }

        return $DB->get_record('smarturl_policy', ['id' => $record->id], '*', MUST_EXIST);
    }

    /**
     * Records a local course edit on a policy-governed Smart URL and increments local_revision.
     *
     * @param int $smarturlid Instance ID.
     * @param int $cmid Course module ID.
     * @param int $userid Actor user ID.
     * @param string|null $customavailability New course-local availability JSON (if updated).
     * @return \stdClass Updated policy record.
     */
    public static function record_local_override(
        int $smarturlid,
        int $cmid,
        int $userid,
        ?string $customavailability = null,
    ): \stdClass {
        global $DB;

        $existing = self::get_by_smarturlid($smarturlid);
        $now = time();
        if ($existing) {
            $existing->cmid = $cmid;
            $existing->local_revision = (int)$existing->local_revision + 1;
            $existing->last_modified_by = $userid;
            $existing->timemodified = $now;
            if ($customavailability !== null || func_num_args() >= 4) {
                $existing->custom_availability_json = $customavailability;
            }
            $DB->update_record('smarturl_policy', $existing);
            return $existing;
        }

        $record = (object)[
            'smarturlid' => $smarturlid,
            'cmid' => $cmid,
            'managed_by' => null,
            'external_key' => null,
            'mandatory' => 0,
            'locked_fields_json' => '[]',
            'managed_availability_json' => null,
            'custom_availability_json' => $customavailability,
            'local_revision' => 1,
            'acked_revision' => 0,
            'last_modified_by' => $userid,
            'timemodified' => $now,
        ];
        $record->id = $DB->insert_record('smarturl_policy', $record);
        return $record;
    }
}
