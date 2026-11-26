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

/**
 * Returns searchable and filterable metadata entries for a Smart URL activity.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class get_metadata extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid' => new external_value(PARAM_INT, 'Course module ID'),
            'query' => new external_value(PARAM_RAW_TRIMMED, 'Optional search query', VALUE_DEFAULT, ''),
            'group' => new external_value(PARAM_RAW_TRIMMED, 'Optional group filter', VALUE_DEFAULT, ''),
        ]);
    }

    /**
     * Returns metadata entries and group facet counts.
     *
     * @param int $cmid Course module ID.
     * @param string $query Optional search filter.
     * @param string $group Optional group filter.
     * @return array<string, mixed>
     */
    public static function execute(int $cmid, string $query = '', string $group = ''): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'cmid' => $cmid,
            'query' => $query,
            'group' => $group,
        ]);

        $cm = get_coursemodule_from_id('smarturl', (int)$params['cmid'], 0, false, MUST_EXIST);
        $context = \context_module::instance($cm->id);
        self::validate_context($context);
        require_capability('mod/smarturl:view', $context);

        $all = metadata_repository::for_instance((int)$cm->instance, false);
        $needle = strtolower(trim((string)$params['query']));
        $wantedgroup = trim((string)$params['group']);

        $searchmatched = array_values(array_filter($all, static function ($entry) use ($needle): bool {
            if ($needle === '') {
                return true;
            }
            if (!$entry['searchable']) {
                return false;
            }
            return str_contains(strtolower($entry['label']), $needle)
                || str_contains(strtolower($entry['key']), $needle)
                || str_contains(strtolower($entry['value']), $needle)
                || str_contains(strtolower($entry['group']), $needle);
        }));

        $groupcounts = [];
        foreach ($searchmatched as $entry) {
            $g = $entry['group'];
            $groupcounts[$g] = ($groupcounts[$g] ?? 0) + 1;
        }

        $items = $wantedgroup === ''
            ? $searchmatched
            : array_values(array_filter($searchmatched, static fn($e) => $e['group'] === $wantedgroup));

        $groupsout = [];
        foreach ($groupcounts as $name => $count) {
            $groupsout[] = ['name' => $name, 'count' => $count];
        }

        return [
            'total' => count($searchmatched),
            'groups' => $groupsout,
            'items' => array_map(static fn($e) => [
                'id' => $e['id'],
                'key' => $e['key'],
                'label' => $e['label'],
                'group' => $e['group'],
                'datatype' => $e['datatype'],
                'priority' => $e['priority'],
                'value' => $e['value'],
            ], $items),
        ];
    }

    /**
     * Return schema.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'total' => new external_value(PARAM_INT, 'Total matching entries'),
            'groups' => new external_multiple_structure(new external_single_structure([
                'name' => new external_value(PARAM_RAW, 'Group name'),
                'count' => new external_value(PARAM_INT, 'Count in group'),
            ])),
            'items' => new external_multiple_structure(new external_single_structure([
                'id' => new external_value(PARAM_INT, 'Entry ID'),
                'key' => new external_value(PARAM_RAW_TRIMMED, 'Metadata key'),
                'label' => new external_value(PARAM_RAW, 'Display label'),
                'group' => new external_value(PARAM_RAW, 'Group name'),
                'datatype' => new external_value(PARAM_ALPHANUMEXT, 'Data type'),
                'priority' => new external_value(PARAM_ALPHANUMEXT, 'Display priority'),
                'value' => new external_value(PARAM_RAW, 'Metadata value'),
            ])),
        ]);
    }
}
