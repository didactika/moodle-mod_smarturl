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

/**
 * Reorders Smart URL modules inside a course section while preserving non-listed modules.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class reorder_section extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'Course ID'),
            'section' => new external_value(PARAM_INT, 'Section number'),
            'cmids' => new external_multiple_structure(new external_value(PARAM_INT, 'Ordered cmids')),
        ]);
    }

    /**
     * Reorders listed course modules inside the target section.
     *
     * @param int $courseid Course ID.
     * @param int $section Section number.
     * @param int[] $cmids Desired order of target cmids.
     * @return array<string, mixed> Result status.
     */
    public static function execute(int $courseid, int $section, array $cmids): array {
        global $DB;

        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid' => $courseid,
            'section' => $section,
            'cmids' => $cmids,
        ]);
        $coursecontext = \context_course::instance((int)$params['courseid']);
        self::validate_context($coursecontext);
        require_capability('mod/smarturl:manageexternal', \context_system::instance());

        $sec = $DB->get_record('course_sections', [
            'course' => (int)$params['courseid'],
            'section' => (int)$params['section'],
        ], '*', MUST_EXIST);

        $current = array_values(array_filter(array_map('intval', explode(',', (string)$sec->sequence))));
        $desired = array_values(array_intersect(array_map('intval', $params['cmids']), $current));
        $desiredset = array_flip($desired);
        $merged = [];
        $idx = 0;

        foreach ($current as $cmid) {
            if (isset($desiredset[$cmid])) {
                $merged[] = $desired[$idx++];
            } else {
                $merged[] = $cmid;
            }
        }

        $DB->set_field('course_sections', 'sequence', implode(',', $merged), ['id' => $sec->id]);
        rebuild_course_cache((int)$params['courseid'], true);

        return ['sectionid' => (int)$sec->id, 'sequence' => $merged];
    }

    /**
     * Return schema.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'sectionid' => new external_value(PARAM_INT, 'Updated section ID'),
            'sequence' => new external_multiple_structure(new external_value(PARAM_INT, 'Final cmid sequence')),
        ]);
    }
}
