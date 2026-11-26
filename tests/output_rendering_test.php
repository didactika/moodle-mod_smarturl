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

use mod_smarturl\local\metadata\metadata_repository;
use mod_smarturl\output\admin_config_page;
use mod_smarturl\output\resource_page;

/**
 * Tests Moodle 4.5 Mustache + AMD output rendering and Didactika Design System markup.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class output_rendering_test extends \advanced_testcase {
    /**
     * Verifies resource_view.mustache compiles cleanly and renders Didactika UI and resolved URLs.
     */
    public function test_resource_view_mustache_renders(): void {
        global $DB, $PAGE;
        $this->resetAfterTest(true);
        $this->setAdminUser();

        $course = $this->getDataGenerator()->create_course(['shortname' => 'DD-MUSTACHE']);
        $user = $this->getDataGenerator()->create_and_enrol($course, 'student', ['username' => 'mstudent']);
        $smarturl = $this->getDataGenerator()->create_module('smarturl', [
            'course' => $course->id,
            'name' => 'Mustache Stage Demo',
            'externalurl' => 'https://media.example.org/{{course_shortname}}?u={{user_username}}',
            'display_mode' => 'EMBED',
        ]);
        metadata_repository::replace_for_instance((int)$smarturl->id, [
            ['key' => 'category', 'value' => 'campus-capitulo IA'],
            ['key' => 'language', 'value' => 'es'],
        ]);

        $cm = get_coursemodule_from_id('smarturl', $smarturl->cmid, 0, false, MUST_EXIST);
        $context = \context_module::instance($cm->id);
        $record = $DB->get_record('smarturl', ['id' => $smarturl->id], '*', MUST_EXIST);

        $PAGE->set_url('/mod/smarturl/view.php', ['id' => $cm->id]);
        $PAGE->set_context($context);
        $renderer = $PAGE->get_renderer('core');

        $html = $renderer->render(new resource_page($record, $course, $cm, $context, $user));
        $this->assertStringContainsString('smu-resource-bar', $html);
        $this->assertStringContainsString('smu-explorer', $html);
        $this->assertStringContainsString('https://media.example.org/DD-MUSTACHE?u=mstudent', $html);
        $this->assertStringContainsString('Mustache Stage Demo', $html);
    }

    /**
     * Verifies admin_config.mustache compiles cleanly and renders Didactika UI tabs and seed payload.
     */
    public function test_admin_config_mustache_renders(): void {
        global $PAGE;
        $this->resetAfterTest(true);
        $this->setAdminUser();

        $PAGE->set_url('/mod/smarturl/admin.php');
        $PAGE->set_context(\context_system::instance());
        $renderer = $PAGE->get_renderer('core');

        $adminhtml = $renderer->render(new admin_config_page());
        $this->assertStringContainsString('dd-page-header', $adminhtml);
        $this->assertStringContainsString('dd-segmented', $adminhtml);
        $this->assertStringContainsString('metaTypes', $adminhtml);

        $builderhtml = $renderer->render(new \mod_smarturl\output\form_builder_widget('params', [], [], false, []));
        $this->assertStringContainsString('smu-form-builder', $builderhtml);
        $this->assertStringContainsString('smu-builder-params', $builderhtml);
    }
}
