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

require_once($CFG->dirroot . '/mod/smarturl/lib.php');
require_once($CFG->libdir . '/completionlib.php');

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;
use mod_smarturl\local\compat\course_module_actions;
use mod_smarturl\local\metadata\metadata_repository;
use mod_smarturl\local\policy\availability_composer;
use mod_smarturl\local\policy\policy_manager;

/**
 * External web service updating Smart URL instances, two-branch availability, policies, and metadata.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class update_instances extends external_api {
    /**
     * Parameter schema.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'instances' => new external_multiple_structure(new external_single_structure([
                'cmid' => new external_value(PARAM_INT, 'Course module ID'),
                'name' => new external_value(PARAM_TEXT, 'Activity name', VALUE_OPTIONAL),
                'externalurl' => new external_value(PARAM_RAW_TRIMMED, 'External URL', VALUE_OPTIONAL),
                'intro' => new external_value(PARAM_RAW, 'Description HTML', VALUE_OPTIONAL),
                'showdescription' => new external_value(PARAM_INT, 'Show description', VALUE_OPTIONAL),
                'visible' => new external_value(PARAM_INT, 'Visibility (0/1)', VALUE_OPTIONAL),
                'section' => new external_value(PARAM_INT, 'Target section number', VALUE_OPTIONAL),
                'displaymode' => new external_value(PARAM_ALPHANUMEXT, 'Display mode', VALUE_OPTIONAL),
                'popupwidth' => new external_value(PARAM_INT, 'Popup width px', VALUE_OPTIONAL),
                'popupheight' => new external_value(PARAM_INT, 'Popup height px', VALUE_OPTIONAL),
                'aspectratio' => new external_value(PARAM_RAW_TRIMMED, 'Aspect ratio', VALUE_OPTIONAL),
                'thumbnailurl' => new external_value(PARAM_RAW_TRIMMED, 'Thumbnail URL', VALUE_OPTIONAL),
                'durationseconds' => new external_value(PARAM_INT, 'Duration seconds', VALUE_OPTIONAL),
                'completion' => new external_value(PARAM_INT, 'Completion tracking', VALUE_OPTIONAL),
                'completionview' => new external_value(PARAM_INT, 'Completion on view', VALUE_OPTIONAL),
                'completionexpected' => new external_value(PARAM_INT, 'Completion expected timestamp', VALUE_OPTIONAL),
                'managedavailability' => new external_value(PARAM_RAW, 'Managed availability branch JSON', VALUE_OPTIONAL),
                'parametersjson' => new external_value(PARAM_RAW, 'Dynamic URL parameters JSON', VALUE_OPTIONAL),
                'managedby' => new external_value(PARAM_ALPHANUMEXT, 'Managed by', VALUE_OPTIONAL),
                'externalkey' => new external_value(PARAM_RAW_TRIMMED, 'External correlation key', VALUE_OPTIONAL),
                'mandatory' => new external_value(PARAM_BOOL, 'Mandatory flag', VALUE_OPTIONAL),
                'lockedfields' => new external_multiple_structure(
                    new external_value(PARAM_ALPHA, 'Locked field group'),
                    'Locked field groups',
                    VALUE_OPTIONAL
                ),
                'metadata' => new external_multiple_structure(
                    new external_single_structure([
                        'key' => new external_value(PARAM_ALPHANUMEXT, 'Metadata key'),
                        'value' => new external_value(PARAM_RAW, 'Metadata value'),
                    ]),
                    'Metadata entries',
                    VALUE_OPTIONAL
                ),
            ])),
        ]);
    }

    /**
     * Updates instances in batch and acknowledges external sync revision.
     *
     * @param array<int, array<string, mixed>> $instances Update payloads.
     * @return array<int, array<string, mixed>> Results.
     */
    public static function execute(array $instances): array {
        global $DB;

        $params = self::validate_parameters(self::execute_parameters(), ['instances' => $instances]);
        self::validate_context(\context_system::instance());
        require_capability('mod/smarturl:manageexternal', \context_system::instance());

        $results = [];
        $dirtycourses = [];

        foreach ($params['instances'] as $item) {
            $cmid = (int)$item['cmid'];
            $cm = get_coursemodule_from_id('smarturl', $cmid, 0, false, MUST_EXIST);
            $course = $DB->get_record('course', ['id' => $cm->course], '*', MUST_EXIST);
            $instance = $DB->get_record('smarturl', ['id' => $cm->instance], '*', MUST_EXIST);

            $update = (object)['instance' => (int)$instance->id, 'coursemodule' => $cmid, '_skippolicycheck' => true];
            if (array_key_exists('name', $item)) {
                $update->name = $item['name'];
            }
            if (array_key_exists('externalurl', $item)) {
                $update->externalurl = $item['externalurl'];
            }
            if (array_key_exists('intro', $item)) {
                $update->intro = $item['intro'];
            }
            if (array_key_exists('showdescription', $item)) {
                $update->showdescription = (int)$item['showdescription'];
                $DB->set_field('course_modules', 'showdescription', (int)$item['showdescription'], ['id' => $cmid]);
            }
            if (array_key_exists('displaymode', $item)) {
                $update->display_mode = $item['displaymode'];
            }
            if (array_key_exists('popupwidth', $item)) {
                $update->popup_width = (int)$item['popupwidth'];
            }
            if (array_key_exists('popupheight', $item)) {
                $update->popup_height = (int)$item['popupheight'];
            }
            if (array_key_exists('aspectratio', $item)) {
                $update->aspect_ratio = $item['aspectratio'];
            }
            if (array_key_exists('thumbnailurl', $item)) {
                $update->thumbnail_url = $item['thumbnailurl'];
            }
            if (array_key_exists('durationseconds', $item)) {
                $update->duration_seconds = $item['durationseconds'];
            }
            if (array_key_exists('parametersjson', $item)) {
                $update->parameters_json = $item['parametersjson'];
            }
            smarturl_update_instance($update);

            if (array_key_exists('metadata', $item)) {
                metadata_repository::replace_for_instance((int)$instance->id, $item['metadata']);
            }

            if (array_key_exists('visible', $item)) {
                course_module_actions::set_visible((int)$course->id, $cmid, (int)$item['visible']);
            }

            if (array_key_exists('section', $item)) {
                $section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => (int)$item['section']], '*', MUST_EXIST);
                if ((int)$cm->section !== (int)$section->id) {
                    $sectioninfo = get_fast_modinfo($course)->get_section_info((int)$section->section, MUST_EXIST);
                    course_module_actions::move_to_section($course, $cmid, $sectioninfo);
                }
            }

            $cmupdate = (object)['id' => $cmid];
            $hascmfields = false;
            foreach (['completion', 'completionview', 'completionexpected'] as $field) {
                if (array_key_exists($field, $item)) {
                    $cmupdate->$field = (int)$item[$field];
                    $hascmfields = true;
                }
            }
            if ($hascmfields) {
                $DB->update_record('course_modules', $cmupdate);
                if (array_key_exists('completionexpected', $item)) {
                    \core_completion\api::update_completion_date_event($cmid, 'smarturl', $instance, (int)$item['completionexpected'] ?: null);
                }
            }

            $policy = policy_manager::get_by_cmid($cmid);
            $managedavail = array_key_exists('managedavailability', $item)
                ? ($item['managedavailability'] ?: null)
                : ($policy->managed_availability_json ?? null);
            $customavail = $policy->custom_availability_json ?? null;
            if (array_key_exists('managedavailability', $item)) {
                $combined = availability_composer::compose($managedavail, $customavail);
                $DB->set_field('course_modules', 'availability', $combined, ['id' => $cmid]);
            }

            $policyinput = ['syncacknowledges' => true];
            foreach (['managedby', 'externalkey', 'mandatory', 'lockedfields', 'managedavailability'] as $pk) {
                if (array_key_exists($pk, $item)) {
                    $policyinput[$pk] = $item[$pk];
                }
            }
            $savedpolicy = policy_manager::upsert_external((int)$instance->id, $cmid, $policyinput);

            $dirtycourses[(int)$course->id] = true;
            $results[] = [
                'cmid' => $cmid,
                'smarturlid' => (int)$instance->id,
                'ackedrevision' => (int)$savedpolicy->acked_revision,
            ];
        }

        foreach (array_keys($dirtycourses) as $cid) {
            rebuild_course_cache($cid, true);
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
            'cmid' => new external_value(PARAM_INT, 'Updated course module ID'),
            'smarturlid' => new external_value(PARAM_INT, 'Updated instance ID'),
            'ackedrevision' => new external_value(PARAM_INT, 'Acknowledged policy revision'),
        ]));
    }
}
