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
use mod_smarturl\local\metadata\param_def_manager;

/**
 * Paginated reader for configured dynamic URL parameter definitions.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class list_param_defs extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'enabledonly' => new external_value(PARAM_BOOL, 'Return only enabled variables', VALUE_DEFAULT, false),
            'page' => new external_value(PARAM_INT, 'Zero-based page index', VALUE_DEFAULT, 0),
            'perpage' => new external_value(PARAM_INT, 'Page size (1-200)', VALUE_DEFAULT, 50),
        ]);
    }

    /**
     * Lists dynamic parameter definitions with pagination.
     *
     * @param bool $enabledonly Filter enabled definitions only.
     * @param int $page Zero-based page index.
     * @param int $perpage Page size (1-200).
     * @return array<string, mixed>
     */
    public static function execute(bool $enabledonly = false, int $page = 0, int $perpage = 50): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'enabledonly' => $enabledonly,
            'page' => $page,
            'perpage' => $perpage,
        ]);
        $context = \context_system::instance();
        self::validate_context($context);

        if (
            !has_any_capability(
                ['mod/smarturl:manageschema', 'mod/smarturl:manageexternal', 'mod/smarturl:addinstance'],
                $context,
            )
        ) {
            require_capability('mod/smarturl:manageschema', $context);
        }

        $page = max(0, (int)$params['page']);
        $perpage = max(1, min(200, (int)$params['perpage']));

        $all = array_values(param_def_manager::list_all((bool)$params['enabledonly']));
        $total = count($all);
        $offset = $page * $perpage;
        $slice = array_slice($all, $offset, $perpage);

        $items = [];
        foreach ($slice as $pd) {
            $items[] = [
                'id' => (int)$pd->id,
                'shortname' => (string)$pd->shortname,
                'name' => (string)$pd->name,
                'sourcetype' => (string)$pd->source_type,
                'sourcekey' => (string)$pd->source_key,
                'defaultqueryparam' => (string)($pd->default_query_param ?? ''),
                'enabled' => (bool)$pd->enabled,
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
            'total' => new external_value(PARAM_INT, 'Total dynamic parameter definitions'),
            'page' => new external_value(PARAM_INT, 'Current page index'),
            'perpage' => new external_value(PARAM_INT, 'Page size'),
            'hasmore' => new external_value(PARAM_BOOL, 'True if further pages exist'),
            'items' => new external_multiple_structure(new external_single_structure([
                'id' => new external_value(PARAM_INT, 'Definition ID'),
                'shortname' => new external_value(PARAM_ALPHANUMEXT, 'Shortname'),
                'name' => new external_value(PARAM_TEXT, 'Display name'),
                'sourcetype' => new external_value(PARAM_ALPHANUMEXT, 'Source type'),
                'sourcekey' => new external_value(PARAM_RAW_TRIMMED, 'Source key'),
                'defaultqueryparam' => new external_value(PARAM_ALPHANUMEXT, 'Suggested query param'),
                'enabled' => new external_value(PARAM_BOOL, 'Enabled'),
            ])),
        ]);
    }
}
