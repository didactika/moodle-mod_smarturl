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
use core_external\external_single_structure;
use core_external\external_value;
use mod_smarturl\local\metadata\param_def_manager;

/**
 * Creates or updates a dynamic URL parameter definition.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class save_param_def extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'id' => new external_value(PARAM_INT, 'Existing ID or 0', VALUE_DEFAULT, 0),
            'shortname' => new external_value(PARAM_ALPHANUMEXT, 'Unique shortname'),
            'name' => new external_value(PARAM_TEXT, 'Display label'),
            'description' => new external_value(PARAM_TEXT, 'Description', VALUE_DEFAULT, ''),
            'source_type' => new external_value(PARAM_ALPHANUMEXT, 'Source type', VALUE_DEFAULT, 'BUILTIN'),
            'source_key' => new external_value(PARAM_RAW_TRIMMED, 'Source key or literal value'),
            'default_query_param' => new external_value(PARAM_ALPHANUMEXT, 'Suggested query param', VALUE_DEFAULT, ''),
            'enabled' => new external_value(PARAM_BOOL, 'Enabled', VALUE_DEFAULT, true),
        ]);
    }

    /**
     * Saves dynamic URL parameter definition.
     *
     * @return array<string, mixed>
     */
    public static function execute(
        int $id,
        string $shortname,
        string $name,
        string $description = '',
        string $sourcetype = 'BUILTIN',
        string $sourcekey = '',
        string $defaultqueryparam = '',
        bool $enabled = true,
    ): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'id' => $id,
            'shortname' => $shortname,
            'name' => $name,
            'description' => $description,
            'source_type' => $sourcetype,
            'source_key' => $sourcekey,
            'default_query_param' => $defaultqueryparam,
            'enabled' => $enabled,
        ]);

        $context = \context_system::instance();
        self::validate_context($context);
        require_capability('mod/smarturl:manageschema', $context);

        $saved = param_def_manager::save($params);
        return (array)$saved;
    }

    /**
     * Return schema.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'id' => new external_value(PARAM_INT, 'ID'),
            'shortname' => new external_value(PARAM_ALPHANUMEXT, 'Shortname'),
            'name' => new external_value(PARAM_TEXT, 'Name'),
            'description' => new external_value(PARAM_RAW, 'Description', VALUE_OPTIONAL),
            'source_type' => new external_value(PARAM_ALPHANUMEXT, 'Source type'),
            'source_key' => new external_value(PARAM_RAW, 'Source key'),
            'default_query_param' => new external_value(PARAM_RAW, 'Default query param', VALUE_OPTIONAL),
            'enabled' => new external_value(PARAM_INT, 'Enabled'),
            'sortorder' => new external_value(PARAM_INT, 'Sort order'),
            'timecreated' => new external_value(PARAM_INT, 'Created timestamp'),
            'timemodified' => new external_value(PARAM_INT, 'Modified timestamp'),
        ]);
    }
}
