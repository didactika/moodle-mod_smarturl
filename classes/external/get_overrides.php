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
 * Returns instances where local_revision > acked_revision for manual resync recovery.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class get_overrides extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'Course ID (0 for all courses)', VALUE_DEFAULT, 0),
        ]);
    }

    /**
     * Lists pending local overrides.
     *
     * @param int $courseid Optional course ID.
     * @return array<int, array<string, mixed>>
     */
    public static function execute(int $courseid = 0): array {
        global $DB;

        $params = self::validate_parameters(self::execute_parameters(), ['courseid' => $courseid]);
        self::validate_context(\context_system::instance());
        require_capability('mod/smarturl:manageexternal', \context_system::instance());

        $coursefilter = !empty($params['courseid']) ? 'AND cm.course = :courseid' : '';
        $sql = "SELECT sp.cmid, cm.course AS courseid, sp.managed_by, sp.external_key,
                       sp.local_revision, sp.acked_revision, sp.custom_availability_json,
                       s.name, s.intro, s.display_mode, s.popup_width, s.popup_height,
                       cm.showdescription, cm.completion, cm.completionview, cm.completionexpected
                  FROM {smarturl_policy} sp
                  JOIN {course_modules} cm ON cm.id = sp.cmid
                  JOIN {smarturl} s ON s.id = sp.smarturlid
                 WHERE sp.local_revision > sp.acked_revision
                       $coursefilter
              ORDER BY cm.course ASC, sp.cmid ASC";

        $rows = $DB->get_records_sql($sql, ['courseid' => (int)$params['courseid']]);
        $out = [];
        foreach ($rows as $r) {
            $out[] = [
                'cmid' => (int)$r->cmid,
                'courseid' => (int)$r->courseid,
                'managedby' => (string)($r->managed_by ?? ''),
                'externalkey' => (string)($r->external_key ?? ''),
                'localrevision' => (int)$r->local_revision,
                'ackedrevision' => (int)$r->acked_revision,
                'name' => (string)$r->name,
                'intro' => (string)($r->intro ?? ''),
                'showdescription' => (int)$r->showdescription,
                'displaymode' => (string)$r->display_mode,
                'popupwidth' => (int)$r->popup_width,
                'popupheight' => (int)$r->popup_height,
                'completion' => (int)$r->completion,
                'completionview' => (int)$r->completionview,
                'completionexpected' => (int)$r->completionexpected,
                'customavailability' => (string)($r->custom_availability_json ?? ''),
            ];
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
            'courseid' => new external_value(PARAM_INT, 'Course ID'),
            'managedby' => new external_value(PARAM_RAW_TRIMMED, 'Managed by'),
            'externalkey' => new external_value(PARAM_RAW_TRIMMED, 'External key'),
            'localrevision' => new external_value(PARAM_INT, 'Local revision'),
            'ackedrevision' => new external_value(PARAM_INT, 'Acked revision'),
            'name' => new external_value(PARAM_RAW, 'Name'),
            'intro' => new external_value(PARAM_RAW, 'Intro'),
            'showdescription' => new external_value(PARAM_INT, 'Show description'),
            'displaymode' => new external_value(PARAM_ALPHANUMEXT, 'Display mode'),
            'popupwidth' => new external_value(PARAM_INT, 'Popup width'),
            'popupheight' => new external_value(PARAM_INT, 'Popup height'),
            'completion' => new external_value(PARAM_INT, 'Completion'),
            'completionview' => new external_value(PARAM_INT, 'Completion view'),
            'completionexpected' => new external_value(PARAM_INT, 'Completion expected'),
            'customavailability' => new external_value(PARAM_RAW, 'Custom availability branch'),
        ]));
    }
}
