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
 * Reads Smart URL instances for one or more courses including policies and metadata.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class get_instances extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseids' => new external_multiple_structure(new external_value(PARAM_INT, 'Course IDs')),
        ]);
    }

    /**
     * Fetches Smart URL instances in the given courses.
     *
     * @param int[] $courseids Course IDs.
     * @return array<int, array<string, mixed>> Instances.
     */
    public static function execute(array $courseids): array {
        global $DB;

        $params = self::validate_parameters(self::execute_parameters(), ['courseids' => $courseids]);
        self::validate_context(\context_system::instance());
        require_capability('mod/smarturl:manageexternal', \context_system::instance());

        $ids = array_values(array_unique(array_filter(array_map('intval', $params['courseids']), static fn($id) => $id > 0)));
        if (empty($ids)) {
            return [];
        }

        [$insql, $inparams] = $DB->get_in_or_equal($ids, SQL_PARAMS_NAMED);
        $sql = "SELECT cm.id AS cmid, cm.course AS courseid, cm.idnumber, cm.visible, cm.showdescription,
                       cm.completion, cm.completionview, cm.completionexpected, cm.availability,
                       cs.section AS sectionnumber, cs.name AS sectionname,
                       s.id AS smarturlid, s.name, s.intro, s.externalurl, s.display_mode, s.popup_width, s.popup_height,
                       s.parameters_json, sp.managed_by, sp.external_key, sp.locked_fields_json,
                       sp.managed_availability_json, sp.custom_availability_json, sp.local_revision, sp.acked_revision
                  FROM {course_modules} cm
                  JOIN {modules} m ON m.id = cm.module AND m.name = 'smarturl'
                  JOIN {smarturl} s ON s.id = cm.instance
                  JOIN {course_sections} cs ON cs.id = cm.section
             LEFT JOIN {smarturl_policy} sp ON sp.smarturlid = s.id
                 WHERE cm.course $insql AND cm.deletioninprogress = 0
              ORDER BY cm.course ASC, cs.section ASC, cm.id ASC";

        $rows = array_values($DB->get_records_sql($sql, $inparams));
        $metabyid = metadata_repository::for_instances(array_map(static fn($r) => (int)$r->smarturlid, $rows), true);

        $out = [];
        foreach ($rows as $r) {
            $out[] = [
                'cmid' => (int)$r->cmid,
                'smarturlid' => (int)$r->smarturlid,
                'courseid' => (int)$r->courseid,
                'idnumber' => (string)($r->idnumber ?? ''),
                'sectionnumber' => (int)$r->sectionnumber,
                'sectionname' => (string)($r->sectionname ?? ''),
                'name' => (string)$r->name,
                'externalurl' => (string)$r->externalurl,
                'intro' => (string)($r->intro ?? ''),
                'showdescription' => (int)$r->showdescription,
                'visible' => (int)$r->visible,
                'displaymode' => (string)$r->display_mode,
                'popupwidth' => (int)$r->popup_width,
                'popupheight' => (int)$r->popup_height,
                'completion' => (int)$r->completion,
                'completionview' => (int)$r->completionview,
                'completionexpected' => (int)$r->completionexpected,
                'availability' => (string)($r->availability ?? ''),
                'managedby' => (string)($r->managed_by ?? ''),
                'externalkey' => (string)($r->external_key ?? ''),
                'lockedfields' => policy_manager::locked_fields((object)['locked_fields_json' => $r->locked_fields_json ?? null]),
                'customavailability' => (string)($r->custom_availability_json ?? ''),
                'localrevision' => (int)($r->local_revision ?? 0),
                'ackedrevision' => (int)($r->acked_revision ?? 0),
                'parametersjson' => (string)($r->parameters_json ?? ''),
                'metadata' => array_map(
                    static fn($m) => ['key' => $m['key'], 'value' => $m['value']],
                    $metabyid[(int)$r->smarturlid] ?? []
                ),
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
            'smarturlid' => new external_value(PARAM_INT, 'Instance ID'),
            'courseid' => new external_value(PARAM_INT, 'Course ID'),
            'idnumber' => new external_value(PARAM_RAW_TRIMMED, 'Module idnumber'),
            'sectionnumber' => new external_value(PARAM_INT, 'Section number'),
            'sectionname' => new external_value(PARAM_RAW, 'Section name'),
            'name' => new external_value(PARAM_RAW, 'Name'),
            'externalurl' => new external_value(PARAM_RAW, 'External URL'),
            'intro' => new external_value(PARAM_RAW, 'Description'),
            'showdescription' => new external_value(PARAM_INT, 'Show description'),
            'visible' => new external_value(PARAM_INT, 'Visible'),
            'displaymode' => new external_value(PARAM_ALPHANUMEXT, 'Display mode'),
            'popupwidth' => new external_value(PARAM_INT, 'Popup width'),
            'popupheight' => new external_value(PARAM_INT, 'Popup height'),
            'completion' => new external_value(PARAM_INT, 'Completion tracking'),
            'completionview' => new external_value(PARAM_INT, 'Completion on view'),
            'completionexpected' => new external_value(PARAM_INT, 'Completion expected'),
            'availability' => new external_value(PARAM_RAW, 'Combined availability JSON'),
            'managedby' => new external_value(PARAM_RAW_TRIMMED, 'Managed by'),
            'externalkey' => new external_value(PARAM_RAW_TRIMMED, 'External key'),
            'lockedfields' => new external_multiple_structure(new external_value(PARAM_ALPHA, 'Locked field')),
            'customavailability' => new external_value(PARAM_RAW, 'Course-local custom availability JSON'),
            'localrevision' => new external_value(PARAM_INT, 'Local revision'),
            'ackedrevision' => new external_value(PARAM_INT, 'Acked revision'),
            'parametersjson' => new external_value(PARAM_RAW, 'Dynamic URL parameters JSON'),
            'metadata' => new external_multiple_structure(new external_single_structure([
                'key' => new external_value(PARAM_RAW_TRIMMED, 'Metadata key'),
                'value' => new external_value(PARAM_RAW, 'Metadata value'),
            ])),
        ]));
    }
}
