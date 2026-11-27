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
use mod_smarturl\local\metadata\metadata_type_manager;

/**
 * Creates or updates a configurable metadata type definition.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class save_meta_type extends external_api {
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
            'group_name' => new external_value(PARAM_TEXT, 'Group name', VALUE_DEFAULT, 'General'),
            'datatype' => new external_value(PARAM_ALPHA, 'Datatype', VALUE_DEFAULT, 'TEXT'),
            'display_priority' => new external_value(PARAM_ALPHA, 'Display priority', VALUE_DEFAULT, 'SECONDARY'),
            'searchable' => new external_value(PARAM_BOOL, 'Searchable', VALUE_DEFAULT, true),
            'filterable' => new external_value(PARAM_BOOL, 'Filterable', VALUE_DEFAULT, true),
            'enabled' => new external_value(PARAM_BOOL, 'Enabled', VALUE_DEFAULT, true),
            'categoryid' => new external_value(PARAM_INT, 'Category ID', VALUE_DEFAULT, 0),
        ]);
    }

    /**
     * Saves metadata type.
     *
     * @param int $id Existing definition ID, or zero for a new field.
     * @param string $shortname Unique field key.
     * @param string $name Display name.
     * @param string $description Field description.
     * @param string $groupname Legacy group name.
     * @param string $datatype Field data type.
     * @param string $displaypriority Default display priority.
     * @param bool $searchable Whether the field is searchable.
     * @param bool $filterable Whether the field is available as a filter.
     * @param bool $enabled Whether the field is enabled.
     * @param int $categoryid Category ID, or zero for no category.
     * @return array<string, mixed>
     */
    public static function execute(
        int $id,
        string $shortname,
        string $name,
        string $description = '',
        string $groupname = 'General',
        string $datatype = 'TEXT',
        string $displaypriority = 'SECONDARY',
        bool $searchable = true,
        bool $filterable = true,
        bool $enabled = true,
        int $categoryid = 0,
    ): array {
        $params = self::validate_parameters(self::execute_parameters(), [
            'id' => $id,
            'shortname' => $shortname,
            'name' => $name,
            'description' => $description,
            'group_name' => $groupname,
            'categoryid' => $categoryid,
            'datatype' => $datatype,
            'display_priority' => $displaypriority,
            'searchable' => $searchable,
            'filterable' => $filterable,
            'enabled' => $enabled,
        ]);

        $context = \context_system::instance();
        self::validate_context($context);
        require_capability('mod/smarturl:manageschema', $context);

        $saved = metadata_type_manager::save($params);
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
            'categoryid' => new external_value(PARAM_INT, 'Category identifier', VALUE_OPTIONAL),
            'group_name' => new external_value(PARAM_TEXT, 'Group name'),
            'datatype' => new external_value(PARAM_ALPHA, 'Datatype'),
            'icon' => new external_value(PARAM_RAW, 'Icon', VALUE_OPTIONAL),
            'display_priority' => new external_value(PARAM_ALPHA, 'Priority'),
            'searchable' => new external_value(PARAM_INT, 'Searchable'),
            'filterable' => new external_value(PARAM_INT, 'Filterable'),
            'enabled' => new external_value(PARAM_INT, 'Enabled'),
            'sortorder' => new external_value(PARAM_INT, 'Sort order'),
            'timecreated' => new external_value(PARAM_INT, 'Created timestamp'),
            'timemodified' => new external_value(PARAM_INT, 'Modified timestamp'),
        ]);
    }
}
