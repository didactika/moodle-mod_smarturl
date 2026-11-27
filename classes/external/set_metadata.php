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

namespace mod_smarturl\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;
use mod_smarturl\local\metadata\metadata_repository;
use mod_smarturl\local\policy\policy_manager;

/**
 * Replaces or merges structured metadata entries on a Smart URL instance.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class set_metadata extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid' => new external_value(PARAM_INT, 'Course module ID'),
            'entries' => new external_multiple_structure(new external_single_structure([
                'key' => new external_value(PARAM_ALPHANUMEXT, 'Metadata field shortname or custom key'),
                'value' => new external_value(PARAM_RAW, 'Value'),
            ])),
            'mode' => new external_value(PARAM_ALPHA, 'replace or merge', VALUE_DEFAULT, 'replace'),
        ]);
    }

    /**
     * Updates metadata for a Smart URL instance.
     *
     * @param int $cmid Course module ID.
     * @param array $entries Entries to write.
     * @param string $mode replace or merge.
     * @return array<string, mixed>
     */
    public static function execute(int $cmid, array $entries, string $mode = 'replace'): array {
        global $USER;

        $params = self::validate_parameters(self::execute_parameters(), [
            'cmid' => $cmid,
            'entries' => $entries,
            'mode' => $mode,
        ]);

        $cm = get_coursemodule_from_id('smarturl', (int)$params['cmid'], 0, false, MUST_EXIST);
        $context = \context_module::instance($cm->id);
        self::validate_context($context);

        if (!has_capability('mod/smarturl:manageexternal', \context_system::instance())) {
            require_capability('mod/smarturl:editmetadata', $context);
            $policy = policy_manager::get_by_cmid((int)$cm->id);
            if (!policy_manager::can_edit_field('metadata', $policy, $context, (int)$USER->id)) {
                throw new \required_capability_exception($context, 'mod/smarturl:editmetadata', 'nopermissions', '');
            }
        }

        if ($params['mode'] === 'merge') {
            $existing = metadata_repository::for_instance((int)$cm->instance, true);
            $map = [];
            foreach ($existing as $e) {
                $map[$e['key']] = ['key' => $e['key'], 'value' => $e['value']];
            }
            foreach ($params['entries'] as $e) {
                $map[$e['key']] = ['key' => (string)$e['key'], 'value' => (string)$e['value']];
            }
            $final = array_values($map);
        } else {
            $final = array_map(
                static fn($e) => ['key' => (string)$e['key'], 'value' => (string)$e['value']],
                $params['entries'],
            );
        }

        metadata_repository::replace_for_instance((int)$cm->instance, $final);
        $stored = metadata_repository::for_instance((int)$cm->instance, false);

        return [
            'cmid' => (int)$cm->id,
            'count' => count($stored),
        ];
    }

    /**
     * Return schema.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'cmid' => new external_value(PARAM_INT, 'Course module ID'),
            'count' => new external_value(PARAM_INT, 'Stored metadata entry count'),
        ]);
    }
}
