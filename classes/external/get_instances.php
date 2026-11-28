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
 * Paginated reader of Smart URL instances across one or more courses using Moodle modinfo and DML APIs.
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
            'page' => new external_value(PARAM_INT, 'Zero-based page index', VALUE_DEFAULT, 0),
            'perpage' => new external_value(PARAM_INT, 'Page size (1-200)', VALUE_DEFAULT, 50),
            'includedetails' => new external_value(PARAM_BOOL, 'Include metadata values', VALUE_DEFAULT, true),
        ]);
    }

    /**
     * Fetches paginated Smart URL instances in the given courses.
     *
     * @param int[] $courseids Course IDs.
     * @param int $page Zero-based page index.
     * @param int $perpage Page size (1-200).
     * @param bool $includedetails Whether to include metadata values.
     * @return array<string, mixed> Paginated result envelope.
     */
    public static function execute(array $courseids, int $page = 0, int $perpage = 50, bool $includedetails = true): array {
        global $DB;

        $params = self::validate_parameters(self::execute_parameters(), [
            'courseids' => $courseids,
            'page' => $page,
            'perpage' => $perpage,
            'includedetails' => $includedetails,
        ]);
        self::validate_context(\context_system::instance());
        require_capability('mod/smarturl:manageexternal', \context_system::instance());

        $page = max(0, (int)$params['page']);
        $perpage = max(1, min(200, (int)$params['perpage']));

        $ids = array_values(array_unique(array_filter(array_map('intval', $params['courseids']), static fn($id) => $id > 0)));
        if (empty($ids)) {
            return ['items' => [], 'total' => 0, 'page' => $page, 'perpage' => $perpage, 'hasmore' => false];
        }

        $cmrefs = [];
        foreach ($ids as $cid) {
            $modinfo = get_fast_modinfo($cid);
            foreach ($modinfo->get_instances_of('smarturl') as $cm) {
                if ((int)$cm->deletioninprogress === 1) {
                    continue;
                }
                $cmrefs[] = $cm;
            }
        }

        $total = count($cmrefs);
        $offset = $page * $perpage;
        $slice = array_slice($cmrefs, $offset, $perpage);
        if (empty($slice)) {
            return ['items' => [], 'total' => $total, 'page' => $page, 'perpage' => $perpage, 'hasmore' => false];
        }

        $instanceids = array_map(static fn($cm) => (int)$cm->instance, $slice);
        $instances = $DB->get_records_list('smarturl', 'id', $instanceids);
        $policies = $DB->get_records_list(
            'smarturl_policy',
            'smarturlid',
            $instanceids,
            '',
            'smarturlid, managed_by, external_key, locked_fields_json, custom_availability_json, local_revision, acked_revision',
        );
        $metabyid = $params['includedetails'] ? metadata_repository::for_instances($instanceids, true) : [];

        $items = [];
        foreach ($slice as $cm) {
            $s = $instances[(int)$cm->instance] ?? null;
            if (!$s) {
                continue;
            }
            $pol = $policies[(int)$s->id] ?? null;
            $secinfo = $cm->get_modinfo()->get_section_info((int)$cm->sectionnum);
            $items[] = [
                'cmid' => (int)$cm->id,
                'smarturlid' => (int)$s->id,
                'courseid' => (int)$cm->course,
                'idnumber' => (string)($cm->idnumber ?? ''),
                'sectionnumber' => (int)$cm->sectionnum,
                'sectionname' => $secinfo ? (string)($secinfo->name ?? '') : '',
                'name' => (string)$s->name,
                'externalurl' => (string)$s->externalurl,
                'intro' => (string)($s->intro ?? ''),
                'showdescription' => (int)$cm->showdescription,
                'visible' => (int)$cm->visible,
                'displaymode' => (string)$s->display_mode,
                'popupwidth' => (int)$s->popup_width,
                'popupheight' => (int)$s->popup_height,
                'completion' => (int)$cm->completion,
                'completionview' => (int)$cm->completionview,
                'completionexpected' => (int)$cm->completionexpected,
                'availability' => (string)($cm->availability ?? ''),
                'managedby' => $pol ? (string)($pol->managed_by ?? '') : '',
                'externalkey' => $pol ? (string)($pol->external_key ?? '') : '',
                'lockedfields' => policy_manager::locked_fields($pol),
                'customavailability' => $pol ? (string)($pol->custom_availability_json ?? '') : '',
                'localrevision' => $pol ? (int)$pol->local_revision : 0,
                'ackedrevision' => $pol ? (int)$pol->acked_revision : 0,
                'parametersjson' => (string)($s->parameters_json ?? ''),
                'presentationjson' => (string)($s->presentation_json ?? ''),
                'translationsjson' => (string)($s->translations_json ?? ''),
                'title' => \mod_smarturl\local\activity_content::title($s),
                'metadata' => array_map(
                    static fn($m) => ['key' => $m['key'], 'value' => $m['value']],
                    $metabyid[(int)$s->id] ?? []
                ),
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
            'total' => new external_value(PARAM_INT, 'Total instances matching filter'),
            'page' => new external_value(PARAM_INT, 'Current page index'),
            'perpage' => new external_value(PARAM_INT, 'Page size'),
            'hasmore' => new external_value(PARAM_BOOL, 'True if further pages exist'),
            'items' => new external_multiple_structure(new external_single_structure([
                'cmid' => new external_value(PARAM_INT, 'Course module ID'),
                'smarturlid' => new external_value(PARAM_INT, 'Instance ID'),
                'courseid' => new external_value(PARAM_INT, 'Course ID'),
                'idnumber' => new external_value(PARAM_RAW_TRIMMED, 'Module idnumber'),
                'sectionnumber' => new external_value(PARAM_INT, 'Section number'),
                'sectionname' => new external_value(PARAM_RAW, 'Section name'),
                'name' => new external_value(PARAM_RAW, 'Name'),
                'externalurl' => new external_value(PARAM_RAW, 'URL template'),
                'intro' => new external_value(PARAM_RAW, 'Intro HTML'),
                'showdescription' => new external_value(PARAM_INT, 'Show description flag'),
                'visible' => new external_value(PARAM_INT, 'Visible flag'),
                'displaymode' => new external_value(PARAM_ALPHANUMEXT, 'Display mode'),
                'popupwidth' => new external_value(PARAM_INT, 'Popup width'),
                'popupheight' => new external_value(PARAM_INT, 'Popup height'),
                'completion' => new external_value(PARAM_INT, 'Completion tracking mode'),
                'completionview' => new external_value(PARAM_INT, 'Completion view flag'),
                'completionexpected' => new external_value(PARAM_INT, 'Completion expected timestamp'),
                'availability' => new external_value(PARAM_RAW, 'Combined availability JSON'),
                'managedby' => new external_value(PARAM_RAW_TRIMMED, 'Managed by'),
                'externalkey' => new external_value(PARAM_RAW_TRIMMED, 'External key'),
                'lockedfields' => new external_multiple_structure(new external_value(PARAM_ALPHA, 'Locked field')),
                'customavailability' => new external_value(PARAM_RAW, 'Custom availability branch JSON'),
                'localrevision' => new external_value(PARAM_INT, 'Local override revision'),
                'ackedrevision' => new external_value(PARAM_INT, 'Acknowledged revision'),
                'parametersjson' => new external_value(PARAM_RAW, 'Dynamic URL parameters JSON'),
                'presentationjson' => new external_value(PARAM_RAW, 'Presentation settings JSON'),
                'translationsjson' => new external_value(PARAM_RAW, 'Translations by language JSON'),
                'title' => new external_value(PARAM_TEXT, 'Title in the current language'),
                'metadata' => new external_multiple_structure(new external_single_structure([
                    'key' => new external_value(PARAM_RAW_TRIMMED, 'Metadata key'),
                    'value' => new external_value(PARAM_RAW, 'Metadata value'),
                ])),
            ])),
        ]);
    }
}
