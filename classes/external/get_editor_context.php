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
use mod_smarturl\local\activity_content;
use mod_smarturl\local\metadata\category_manager;
use mod_smarturl\local\metadata\metadata_type_manager;
use mod_smarturl\local\metadata\param_def_manager;
use mod_smarturl\local\presentation;

/**
 * Delivers the resource editor catalogue in one context-checked request.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class get_editor_context extends external_api {
    /**
     * Request contract.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'Course ID'),
            'cmid' => new external_value(PARAM_INT, 'Activity ID or zero', VALUE_DEFAULT, 0),
        ]);
    }

    /**
     * Loads the effective editor configuration.
     *
     * @param int $courseid Course ID.
     * @param int $cmid Activity ID, or zero for a new activity.
     * @return array
     */
    public static function execute(int $courseid, int $cmid = 0): array {
        global $DB;
        $params = self::validate_parameters(self::execute_parameters(), ['courseid' => $courseid, 'cmid' => $cmid]);
        $courseid = $params['courseid'];
        $cmid = $params['cmid'];
        $cm = $cmid ? get_coursemodule_from_id('smarturl', $cmid, $courseid, false, MUST_EXIST) : null;
        $context = $cm ? \context_module::instance($cmid) : \context_course::instance($courseid);
        self::validate_context($context);
        require_capability($cm ? 'moodle/course:manageactivities' : 'mod/smarturl:addinstance', $context);
        $instance = $cm ? $DB->get_record('smarturl', ['id' => $cm->instance], '*', MUST_EXIST) : (object)[];
        $payload = [
            'categories' => array_values(array_filter(category_manager::all(), static fn($item) => $item->enabled)),
            'fields' => metadata_type_manager::list_all(true),
            'variables' => array_map(static fn($item) => [
                'shortname' => $item->shortname,
                'name' => $item->name,
                'source_type' => $item->source_type,
                'default_query_param' => $item->default_query_param,
            ], param_def_manager::list_all(true)),
            'languages' => get_string_manager()->get_list_of_translations(),
            'presentation' => presentation::for_instance($instance),
            'translations' => activity_content::translations($instance),
        ];
        return ['catalogue' => json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE)];
    }

    /**
     * Response contract.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'catalogue' => new external_value(PARAM_RAW, 'Editor catalogue and activity configuration JSON'),
        ]);
    }
}
