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

namespace mod_smarturl;

use mod_smarturl\local\activity_content;
use mod_smarturl\local\metadata\category_manager;
use mod_smarturl\local\metadata\metadata_repository;
use mod_smarturl\local\metadata\metadata_type_manager;
use mod_smarturl\local\presentation;
use mod_smarturl\local\url\resource_target;
use mod_smarturl\local\url\url_resolver;

/**
 * Covers resources, presentation profiles, and non-destructive schema changes.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\local\url\resource_target::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\local\presentation::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\local\activity_content::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\local\viewer_data::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\local\metadata\category_manager::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\external\save_instances::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\external\get_editor_context::class)]
final class resource_experience_test extends \advanced_testcase {
    /**
     * Checks the resource formats and the canonical player URL.
     */
    public function test_target_kind_and_youtube_formats(): void {
        $this->resetAfterTest();
        $this->assertSame('audio', resource_target::describe('https://example.org/audio.wav')['kind']);
        $this->assertSame('frame', resource_target::describe('https://example.org/document.pdf')['kind']);
        $this->assertSame('image', resource_target::describe('https://example.org/image.png')['kind']);
        $this->assertSame('link', resource_target::describe('https://example.org/course')['kind']);
        $this->assertSame('frame', resource_target::describe('https://example.org/course', true)['kind']);
        $this->assertSame('link', resource_target::describe('https://youtube.com.example.org/watch?v=M7lc1UVf-VE')['kind']);
        foreach (['https://youtu.be/M7lc1UVf-VE?t=1m3s', 'https://www.youtube.com/shorts/M7lc1UVf-VE?start=63'] as $url) {
            $target = resource_target::describe($url);
            $this->assertSame($url, $target['url']);
            $this->assertSame('www.youtube-nocookie.com', parse_url($target['embedurl'], PHP_URL_HOST));
            $this->assertSame('/embed/M7lc1UVf-VE', parse_url($target['embedurl'], PHP_URL_PATH));
            parse_str((string)parse_url($target['embedurl'], PHP_URL_QUERY), $query);
            $this->assertSame('63', $query['start']);
        }
        $this->assertSame(
            'https://example.org/sample-value?mode=example',
            url_resolver::preview_sample(
                'https://example.org/{{user_email}}',
                [['param' => 'mode', 'mode' => 'static', 'value' => 'example']]
            )
        );
        $this->expectException(\invalid_parameter_exception::class);
        resource_target::normalise('javascript:alert(1)');
    }

    /**
     * Checks partial presentation updates and language fallbacks.
     */
    public function test_profile_and_translations_keep_independent_settings(): void {
        $activity = (object)['display_mode' => 'CARD', 'name' => 'Original'];
        $activity->presentation_json = presentation::from_submission((object)[
            'presentation_json' => '{"launch":"VIEWERWINDOW","coursefields":[]}',
        ], $activity);
        $profile = presentation::for_instance($activity);
        $this->assertSame('CARD', $profile['course']);
        $this->assertSame('VIEWERWINDOW', $profile['launch']);
        $this->assertSame([], $profile['coursefields']);
        $activity->translations_json = activity_content::encode(['es' => ['title' => 'Traducido']]);
        $this->assertSame('Traducido', activity_content::title($activity, 'es'));
        $this->assertSame('Original', activity_content::title($activity, 'en'));
    }

    /**
     * Confirms hidden values are kept when an unrelated edit replaces metadata.
     */
    public function test_hidden_category_and_archived_definition(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $course = $this->getDataGenerator()->create_course();
        $module = $this->getDataGenerator()->create_module('smarturl', ['course' => $course->id]);
        $category = category_manager::save(0, 'Hidden test', true);
        $field = metadata_type_manager::save([
            'shortname' => 'private_field',
            'name' => 'Private field',
            'categoryid' => $category->id,
        ]);
        metadata_repository::replace_for_instance($module->id, [['key' => 'private_field', 'value' => 'Stored value']]);
        category_manager::save($category->id, 'Hidden test', false);
        metadata_repository::replace_for_instance($module->id, []);
        $this->assertSame([], metadata_repository::for_instance($module->id));
        category_manager::save($category->id, 'Hidden test', true);
        $this->assertSame('Stored value', metadata_repository::for_instance($module->id)[0]['value']);
        category_manager::save($category->id, 'Hidden test', false);
        metadata_type_manager::delete($field->id);
        category_manager::save($category->id, 'Hidden test', true);
        $this->assertSame([], metadata_repository::for_instance($module->id));
    }

    /**
     * Ensures the editor catalogue is available only to users who can edit an activity.
     */
    public function test_editor_catalogue_permissions(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $course = $this->getDataGenerator()->create_course();
        $payload = \mod_smarturl\external\get_editor_context::execute($course->id);
        $catalogue = json_decode($payload['catalogue'], true, 32, JSON_THROW_ON_ERROR);
        $this->assertNotEmpty($catalogue['categories']);
        $this->assertNotEmpty($catalogue['variables']);
        $this->setUser($this->getDataGenerator()->create_and_enrol($course, 'student'));
        $this->expectException(\required_capability_exception::class);
        \mod_smarturl\external\get_editor_context::execute($course->id);
    }

    /**
     * A retried managed write updates the same activity.
     */
    public function test_batch_save_reuses_a_managed_reference(): void {
        $this->resetAfterTest();
        $this->setAdminUser();
        $course = $this->getDataGenerator()->create_course();
        $resource = [
            'courseid' => $course->id,
            'section' => 0,
            'name' => 'Managed example',
            'externalurl' => 'https://example.org/doc.pdf',
            'managedby' => 'integration',
            'externalkey' => 'document',
        ];
        $result = \mod_smarturl\external\save_instances::execute([['reference' => 'document', 'data' => json_encode($resource)]]);
        $this->assertTrue($result[0]['saved'], $result[0]['error']);
        $resource['name'] = 'Updated managed example';
        $replayed = \mod_smarturl\external\save_instances::execute([['reference' => 'document', 'data' => json_encode($resource)]]);
        $this->assertTrue($replayed[0]['saved'], $replayed[0]['error']);
        $this->assertSame($result[0]['cmid'], $replayed[0]['cmid']);
    }

    /**
     * Copies the presentation, metadata, translation and its file to a new activity.
     */
    public function test_duplicate_preserves_resource_content(): void {
        global $CFG, $DB;
        $this->resetAfterTest();
        $this->setAdminUser();
        require_once($CFG->dirroot . '/course/lib.php');
        $course = $this->getDataGenerator()->create_course();
        $activity = $this->getDataGenerator()->create_module('smarturl', [
            'course' => $course->id,
            'presentation_json' => '{"launch":"VIEWERTAB"}',
            'translations_json' => '{"es":{"title":"Traducido","description":"<p>@@PLUGINFILE@@/handout.txt</p>"}}',
            'metadata_entries' => [['key' => 'language', 'value' => 'Español']],
        ]);
        $cm = get_fast_modinfo($course)->get_cm($activity->cmid);
        $file = [
            'contextid' => $cm->context->id,
            'component' => 'mod_smarturl',
            'filearea' => 'translation',
            'itemid' => activity_content::file_itemid('es'),
            'filepath' => '/',
            'filename' => 'handout.txt',
        ];
        get_file_storage()->create_file_from_string($file, 'Spanish handout');
        $copy = \core_courseformat\formatactions::cm($course->id)->duplicate($cm->id);
        $this->assertNotNull($copy);
        $record = $DB->get_record('smarturl', ['id' => $copy->instance], '*', MUST_EXIST);
        $this->assertSame('VIEWERTAB', presentation::for_instance($record)['launch']);
        $this->assertSame('Traducido', activity_content::title($record, 'es'));
        $this->assertSame('Español', metadata_repository::for_instance($record->id)[0]['value']);
        $this->assertTrue(get_file_storage()->file_exists(
            $copy->context->id,
            'mod_smarturl',
            'translation',
            $file['itemid'],
            '/',
            'handout.txt'
        ));
    }

    /**
     * Serves a copied file without emitting the original URL and preserves it in duplicate activities.
     */
    public function test_protected_copy_uses_moodle_file_url(): void {
        global $CFG, $DB, $USER;
        $this->resetAfterTest();
        $this->setAdminUser();
        require_once($CFG->dirroot . '/course/lib.php');
        $course = $this->getDataGenerator()->create_course();
        $origin = 'https://origin.example.org/private-document.pdf';
        $activity = $this->getDataGenerator()->create_module('smarturl', [
            'course' => $course->id,
            'externalurl' => $origin,
        ]);
        $context = \context_module::instance($activity->cmid);
        $draftid = file_get_unused_draft_itemid();
        get_file_storage()->create_file_from_string([
            'contextid' => \context_user::instance($USER->id)->id,
            'component' => 'user',
            'filearea' => 'draft',
            'itemid' => $draftid,
            'filepath' => '/',
            'filename' => 'handout.pdf',
        ], '%PDF-1.7');
        smarturl_update_instance((object)[
            'instance' => $activity->id,
            'coursemodule' => $activity->cmid,
            'smu_protected' => 1,
            'smu_resourcefile' => $draftid,
        ], new \stdClass());

        $record = $DB->get_record('smarturl', ['id' => $activity->id], '*', MUST_EXIST);
        $this->assertSame($origin, $record->externalurl);
        $target = \mod_smarturl\local\viewer_data::prepare($record, $course, $USER, $context);
        $this->assertStringContainsString('pluginfile.php', $target['target']['url']);
        $this->assertStringNotContainsString('origin.example.org', json_encode($target));
        $this->assertSame('frame', $target['target']['kind']);

        $duplicate = \core_courseformat\formatactions::cm($course->id)->duplicate($activity->cmid);
        $this->assertNotNull($duplicate);
        $copy = \mod_smarturl\local\protected_resource::target($duplicate->context);
        $this->assertStringContainsString('/' . $duplicate->context->id . '/mod_smarturl/resource/', $copy['url']);

        get_file_storage()->delete_area_files($context->id, 'mod_smarturl', 'resource');
        $this->expectException(\moodle_exception::class);
        \mod_smarturl\local\viewer_data::prepare($record, $course, $USER, $context);
    }

    /**
     * Gives a deferred player a Moodle URL and preserves explicit publication settings.
     */
    public function test_deferred_player_omits_the_origin(): void {
        $this->resetAfterTest();
        $origin = 'https://youtu.be/M7lc1UVf-VE';
        $target = resource_target::describe($origin);
        $markup = \mod_smarturl\local\viewer_data::player_markup($target, 'Video', 42, true);
        $this->assertStringContainsString('/mod/smarturl/player.php?id=42', $markup);
        $this->assertStringNotContainsString('M7lc1UVf-VE', $markup);
        $legacy = (object)['presentation_json' => '{"gateway":true}'];
        $unpublished = (object)['presentation_json' => presentation::from_submission((object)['smu_deferred' => 0], $legacy)];
        $this->assertTrue(presentation::for_instance($unpublished)['gateway']);
        $updated = (object)['presentation_json' => presentation::from_submission((object)['smu_deferred' => 1], $legacy)];
        $this->assertTrue(presentation::for_instance($updated)['deferred']);
        $this->assertFalse(presentation::for_instance($updated)['gateway']);
    }
}
