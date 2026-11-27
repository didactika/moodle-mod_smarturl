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

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/course/modlib.php');
require_once($CFG->dirroot . '/mod/smarturl/lib.php');

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;
use mod_smarturl\local\policy\availability_composer;
use mod_smarturl\local\policy\policy_manager;

/**
 * External web service creating batch Smart URL instances with policy locks and metadata.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class create_instances extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'instances' => new external_multiple_structure(new external_single_structure([
                'courseid' => new external_value(PARAM_INT, 'Course ID'),
                'section' => new external_value(PARAM_INT, 'Section number'),
                'name' => new external_value(PARAM_TEXT, 'Activity name'),
                'externalurl' => new external_value(PARAM_RAW_TRIMMED, 'External URL or template'),
                'idnumber' => new external_value(PARAM_RAW_TRIMMED, 'Course module idnumber', VALUE_DEFAULT, ''),
                'intro' => new external_value(PARAM_RAW, 'Description HTML', VALUE_DEFAULT, ''),
                'showdescription' => new external_value(PARAM_INT, 'Show description on course page', VALUE_DEFAULT, 0),
                'visible' => new external_value(PARAM_INT, 'Module visibility', VALUE_DEFAULT, 1),
                'displaymode' => new external_value(PARAM_ALPHANUMEXT, 'Display mode', VALUE_DEFAULT, 'AUTO'),
                'popupwidth' => new external_value(PARAM_INT, 'Popup width px', VALUE_DEFAULT, 1200),
                'popupheight' => new external_value(PARAM_INT, 'Popup height px', VALUE_DEFAULT, 800),
                'aspectratio' => new external_value(PARAM_RAW_TRIMMED, 'Aspect ratio', VALUE_DEFAULT, '16:9'),
                'thumbnailurl' => new external_value(PARAM_RAW_TRIMMED, 'Thumbnail URL', VALUE_DEFAULT, ''),
                'durationseconds' => new external_value(PARAM_INT, 'Duration seconds', VALUE_DEFAULT, 0),
                'completion' => new external_value(PARAM_INT, 'Completion tracking mode (0/1/2)', VALUE_DEFAULT, 0),
                'completionview' => new external_value(PARAM_INT, 'Completion on view (0/1)', VALUE_DEFAULT, 0),
                'completionexpected' => new external_value(PARAM_INT, 'Completion expected timestamp', VALUE_DEFAULT, 0),
                'managedavailability' => new external_value(PARAM_RAW, 'Managed availability JSON', VALUE_DEFAULT, ''),
                'presentationjson' => new external_value(PARAM_RAW, 'Presentation settings JSON', VALUE_DEFAULT, ''),
                'translationsjson' => new external_value(PARAM_RAW, 'Translations by language JSON', VALUE_DEFAULT, ''),
                'parametersjson' => new external_value(PARAM_RAW, 'Dynamic URL parameters JSON', VALUE_DEFAULT, ''),
                'managedby' => new external_value(PARAM_ALPHANUMEXT, 'External manager name', VALUE_DEFAULT, ''),
                'externalkey' => new external_value(PARAM_RAW_TRIMMED, 'External correlation key', VALUE_DEFAULT, ''),
                'mandatory' => new external_value(PARAM_BOOL, 'Mandatory policy flag', VALUE_DEFAULT, false),
                'lockedfields' => new external_multiple_structure(
                    new external_value(PARAM_ALPHA, 'Locked field group'),
                    'Locked field groups',
                    VALUE_DEFAULT,
                    []
                ),
                'metadata' => new external_multiple_structure(
                    new external_single_structure([
                        'key' => new external_value(PARAM_ALPHANUMEXT, 'Metadata type shortname or custom key'),
                        'value' => new external_value(PARAM_RAW, 'Metadata value'),
                    ]),
                    'Structured metadata entries',
                    VALUE_DEFAULT,
                    []
                ),
            ])),
        ]);
    }

    /**
     * Creates Smart URL instances in batch.
     *
     * @param array $instances Requested instances.
     * @return array<int, array<string, mixed>> Creation results.
     */
    public static function execute(array $instances): array {
        global $DB;

        $params = self::validate_parameters(self::execute_parameters(), ['instances' => $instances]);
        self::validate_context(\context_system::instance());
        require_capability('mod/smarturl:manageexternal', \context_system::instance());

        $module = $DB->get_record('modules', ['name' => 'smarturl'], '*', MUST_EXIST);
        $results = [];

        foreach ($params['instances'] as $item) {
            $course = $DB->get_record('course', ['id' => (int)$item['courseid']], '*', MUST_EXIST);
            $coursecontext = \context_course::instance($course->id);
            require_capability('mod/smarturl:addinstance', $coursecontext);

            availability_composer::validate_external($item['managedavailability']);
            $combinedavail = availability_composer::compose($item['managedavailability'] ?: null, null);
            $moduleinfo = (object)[
                'modulename' => 'smarturl',
                'module' => (int)$module->id,
                'course' => (int)$course->id,
                'section' => (int)$item['section'],
                'name' => $item['name'],
                'intro' => $item['intro'],
                'introformat' => FORMAT_HTML,
                'introeditor' => ['text' => $item['intro'], 'format' => FORMAT_HTML, 'itemid' => 0],
                'externalurl' => $item['externalurl'],
                'display_mode' => strtoupper((string)$item['displaymode']),
                'popup_width' => (int)$item['popupwidth'] ?: 1200,
                'popup_height' => (int)$item['popupheight'] ?: 800,
                'aspect_ratio' => $item['aspectratio'] ?: '16:9',
                'thumbnail_url' => $item['thumbnailurl'] ?: null,
                'duration_seconds' => !empty($item['durationseconds']) ? (int)$item['durationseconds'] : null,
                'parameters_json' => $item['parametersjson'] ?: null,
                'presentation_json' => $item['presentationjson'] ?: null,
                'translations_json' => $item['translationsjson'] ?: null,
                'metadata_entries' => $item['metadata'],
                'showdescription' => (int)$item['showdescription'],
                'visible' => (int)$item['visible'],
                'visibleoncoursepage' => 1,
                'cmidnumber' => (string)$item['idnumber'],
                'availabilityconditionsjson' => $combinedavail ?? '',
                'completion' => (int)$item['completion'],
                'completionview' => (int)$item['completionview'],
                'completionexpected' => (int)$item['completionexpected'],
            ];

            $created = add_moduleinfo($moduleinfo, $course);
            $cmid = (int)$created->coursemodule;
            $smarturlid = (int)$created->instance;

            $policy = policy_manager::upsert_external($smarturlid, $cmid, [
                'managedby' => $item['managedby'] ?: null,
                'externalkey' => $item['externalkey'] ?: null,
                'mandatory' => !empty($item['mandatory']),
                'lockedfields' => $item['lockedfields'],
                'managedavailability' => $item['managedavailability'] ?: null,
                'syncacknowledges' => true,
            ]);

            $results[] = [
                'cmid' => $cmid,
                'smarturlid' => $smarturlid,
                'idnumber' => (string)$item['idnumber'],
                'localrevision' => (int)$policy->local_revision,
            ];
        }

        return $results;
    }

    /**
     * Return schema.
     *
     * @return external_multiple_structure
     */
    public static function execute_returns(): external_multiple_structure {
        return new external_multiple_structure(new external_single_structure([
            'cmid' => new external_value(PARAM_INT, 'Created course module ID'),
            'smarturlid' => new external_value(PARAM_INT, 'Created smarturl instance ID'),
            'idnumber' => new external_value(PARAM_RAW_TRIMMED, 'Module idnumber'),
            'localrevision' => new external_value(PARAM_INT, 'Policy revision'),
        ]));
    }
}
