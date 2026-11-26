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
use mod_smarturl\local\url\url_resolver;

/**
 * Resolves a URL template and dynamic parameter bindings against a course and current user for admin previewing.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class preview_url extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'template' => new external_value(PARAM_RAW_TRIMMED, 'URL template'),
            'courseid' => new external_value(PARAM_INT, 'Course ID (or site ID 1)', VALUE_DEFAULT, 1),
            'bindings' => new external_multiple_structure(
                new external_single_structure([
                    'param' => new external_value(PARAM_ALPHANUMEXT, 'Query parameter name'),
                    'mode' => new external_value(PARAM_ALPHA, 'def or static', VALUE_DEFAULT, 'def'),
                    'var' => new external_value(PARAM_ALPHANUMEXT, 'Parameter shortname', VALUE_DEFAULT, ''),
                    'value' => new external_value(PARAM_RAW, 'Static value', VALUE_DEFAULT, ''),
                ]),
                'Query bindings',
                VALUE_DEFAULT,
                []
            ),
        ]);
    }

    /**
     * Resolves preview URL.
     *
     * @param string $template URL template.
     * @param int $courseid Course ID.
     * @param array<int, array<string, mixed>> $bindings Query parameter bindings.
     * @return array<string, string>
     */
    public static function execute(string $template, int $courseid = 1, array $bindings = []): array {
        global $DB, $SITE, $USER;

        $params = self::validate_parameters(self::execute_parameters(), [
            'template' => $template,
            'courseid' => $courseid,
            'bindings' => $bindings,
        ]);

        $context = \context_system::instance();
        self::validate_context($context);
        require_capability('mod/smarturl:manageschema', $context);

        $course = !empty($params['courseid'])
            ? ($DB->get_record('course', ['id' => (int)$params['courseid']]) ?: $SITE)
            : $SITE;

        $resolved = url_resolver::preview((string)$params['template'], $params['bindings'], $course, $USER, 0);
        return ['resolved' => $resolved];
    }

    /**
     * Return schema.
     *
     * @return external_single_structure
     */
    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'resolved' => new external_value(PARAM_RAW, 'Resolved external URL'),
        ]);
    }
}
