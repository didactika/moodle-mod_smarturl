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
 * Paginated reader returning instances where local_revision exceeds acked_revision using Moodle DML APIs.
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
            'page' => new external_value(PARAM_INT, 'Zero-based page index', VALUE_DEFAULT, 0),
            'perpage' => new external_value(PARAM_INT, 'Page size (1-200)', VALUE_DEFAULT, 50),
        ]);
    }

    /**
     * Lists pending local overrides cleanly with pagination.
     *
     * @param int $courseid Optional course ID.
     * @param int $page Zero-based page index.
     * @param int $perpage Page size (1-200).
     * @return array<string, mixed> Paginated response.
     */
    public static function execute(int $courseid = 0, int $page = 0, int $perpage = 50): array {
        global $DB;

        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid' => $courseid,
            'page' => $page,
            'perpage' => $perpage,
        ]);
        self::validate_context(\context_system::instance());
        require_capability('mod/smarturl:manageexternal', \context_system::instance());

        $page = max(0, (int)$params['page']);
        $perpage = max(1, min(200, (int)$params['perpage']));

        $policies = array_values($DB->get_records_select(
            'smarturl_policy',
            'local_revision > acked_revision',
            [],
            'cmid ASC'
        ));
        if (empty($policies)) {
            return ['items' => [], 'total' => 0, 'page' => $page, 'perpage' => $perpage, 'hasmore' => false];
        }

        $cmids = array_map(static fn($p) => (int)$p->cmid, $policies);
        $smarturlids = array_map(static fn($p) => (int)$p->smarturlid, $policies);
        $cms = $DB->get_records_list('course_modules', 'id', $cmids);
        $instances = $DB->get_records_list('smarturl', 'id', $smarturlids);

        $filtered = [];
        $targetcourse = (int)$params['courseid'];
        foreach ($policies as $pol) {
            $cm = $cms[(int)$pol->cmid] ?? null;
            $s = $instances[(int)$pol->smarturlid] ?? null;
            if (!$cm || !$s) {
                continue;
            }
            if ($targetcourse > 0 && (int)$cm->course !== $targetcourse) {
                continue;
            }
            $filtered[] = [$pol, $cm, $s];
        }

        $total = count($filtered);
        $offset = $page * $perpage;
        $slice = array_slice($filtered, $offset, $perpage);

        $items = [];
        foreach ($slice as [$pol, $cm, $s]) {
            $items[] = [
                'cmid' => (int)$pol->cmid,
                'courseid' => (int)$cm->course,
                'managedby' => (string)($pol->managed_by ?? ''),
                'externalkey' => (string)($pol->external_key ?? ''),
                'localrevision' => (int)$pol->local_revision,
                'ackedrevision' => (int)$pol->acked_revision,
                'name' => (string)$s->name,
                'intro' => (string)($s->intro ?? ''),
                'showdescription' => (int)$cm->showdescription,
                'displaymode' => (string)$s->display_mode,
                'popupwidth' => (int)$s->popup_width,
                'popupheight' => (int)$s->popup_height,
                'completion' => (int)$cm->completion,
                'completionview' => (int)$cm->completionview,
                'completionexpected' => (int)$cm->completionexpected,
                'customavailability' => (string)($pol->custom_availability_json ?? ''),
            ];
        }

        return [
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'perpage' => $perpage,
            'hasmore' => ($offset + count($items)) < $total,
        ];
    }

    /**
     * Return schema.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'total' => new external_value(PARAM_INT, 'Total matching override records'),
            'page' => new external_value(PARAM_INT, 'Current page index'),
            'perpage' => new external_value(PARAM_INT, 'Page size'),
            'hasmore' => new external_value(PARAM_BOOL, 'True if further pages exist'),
            'items' => new external_multiple_structure(new external_single_structure([
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
            ])),
        ]);
    }
}
