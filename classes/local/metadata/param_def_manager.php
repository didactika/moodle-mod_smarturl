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

namespace mod_smarturl\local\metadata;

/**
 * Manages configurable dynamic URL parameter definitions.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class param_def_manager {
    /** @var string[] Supported parameter resolution sources. */
    public const SOURCE_TYPES = ['BUILTIN', 'USER_PROFILE_FIELD', 'COURSE_CUSTOM_FIELD', 'STATIC'];

    /**
     * Lists dynamic URL parameter definitions.
     *
     * @param bool $enabledonly Whether to return only enabled rows.
     * @return \stdClass[]
     */
    public static function list_all(bool $enabledonly = false): array {
        global $DB;

        $conditions = $enabledonly ? ['enabled' => 1] : null;
        return array_values($DB->get_records('smarturl_param_def', $conditions, 'sortorder ASC, id ASC'));
    }

    /**
     * Creates or updates a dynamic URL parameter definition.
     *
     * @param array<string, mixed> $data Input fields.
     * @return \stdClass Saved record.
     */
    public static function save(array $data): \stdClass {
        global $DB;

        $id = !empty($data['id']) ? (int)$data['id'] : 0;
        $shortname = clean_param(strtolower(trim((string)$data['shortname'])), PARAM_ALPHANUMEXT);
        if ($shortname === '') {
            throw new \invalid_parameter_exception('Parameter shortname is required.');
        }

        $sourcetype = strtoupper((string)($data['source_type'] ?? 'BUILTIN'));
        if (!in_array($sourcetype, self::SOURCE_TYPES, true)) {
            $sourcetype = 'BUILTIN';
        }

        $existing = $DB->get_record('smarturl_param_def', ['shortname' => $shortname]);
        if ($existing && (int)$existing->id !== $id) {
            throw new \invalid_parameter_exception("Duplicate parameter shortname '$shortname'.");
        }

        $now = time();
        $record = (object)[
            'shortname' => $shortname,
            'name' => trim((string)($data['name'] ?? $shortname)),
            'description' => isset($data['description']) ? trim((string)$data['description']) : null,
            'source_type' => $sourcetype,
            'source_key' => trim((string)($data['source_key'] ?? '')),
            'default_query_param' => !empty($data['default_query_param']) ? trim((string)$data['default_query_param']) : null,
            'enabled' => isset($data['enabled']) ? (int)!empty($data['enabled']) : 1,
            'sortorder' => (int)($data['sortorder'] ?? 0),
            'timemodified' => $now,
        ];

        if ($id > 0) {
            $record->id = $id;
            $DB->update_record('smarturl_param_def', $record);
        } else {
            $record->timecreated = $now;
            if ($record->sortorder <= 0) {
                $record->sortorder = (int)$DB->count_records('smarturl_param_def') + 1;
            }
            $record->id = $DB->insert_record('smarturl_param_def', $record);
        }

        return $DB->get_record('smarturl_param_def', ['id' => $record->id], '*', MUST_EXIST);
    }

    /**
     * Deletes a dynamic URL parameter definition.
     *
     * @param int $id Parameter definition ID.
     */
    public static function delete(int $id): void {
        global $DB;
        $DB->delete_records('smarturl_param_def', ['id' => $id]);
    }
}
