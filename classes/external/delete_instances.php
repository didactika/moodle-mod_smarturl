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
use mod_smarturl\local\compat\course_module_actions;

/**
 * Deletes Smart URL course modules cleanly.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class delete_instances extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmids' => new external_multiple_structure(new external_value(PARAM_INT, 'Course module IDs')),
        ]);
    }

    /**
     * Executes deletion for each existing Smart URL course module.
     *
     * @param int[] $cmids Course module IDs.
     * @return array<int, array<string, mixed>> Deletion statuses.
     */
    public static function execute(array $cmids): array {
        $params = self::validate_parameters(self::execute_parameters(), ['cmids' => $cmids]);
        self::validate_context(\context_system::instance());
        require_capability('mod/smarturl:manageexternal', \context_system::instance());

        $out = [];
        foreach ($params['cmids'] as $cmid) {
            $cm = get_coursemodule_from_id('smarturl', (int)$cmid);
            if (!$cm) {
                $out[] = ['cmid' => (int)$cmid, 'deleted' => false];
                continue;
            }
            course_module_actions::delete((int)$cm->course, (int)$cm->id);
            $out[] = ['cmid' => (int)$cmid, 'deleted' => true];
        }
        return $out;
    }

    /**
     * Return schema.
     *
     * @return external_multiple_structure
     */
    public static function execute_returns(): external_multiple_structure {
        return new external_multiple_structure(new external_single_structure([
            'cmid' => new external_value(PARAM_INT, 'Course module ID'),
            'deleted' => new external_value(PARAM_BOOL, 'Whether deleted'),
        ]));
    }
}
