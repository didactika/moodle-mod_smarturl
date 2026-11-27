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

use mod_smarturl\output\admin_config_page;
use mod_smarturl\output\resource_page;

/**
 * Tests Moodle 5.3 React/ESM output renderables and dynamic resolution props.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\output\renderer::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\output\admin_config_page::class)]
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\output\resource_page::class)]
final class output_rendering_test extends \advanced_testcase {
    /**
     * Verifies ResourceView and AdminConfig renderables export expected props and mount markup.
     */
    public function test_react_renderables_and_props(): void {
        global $DB, $PAGE;
        $this->resetAfterTest(true);
        $this->setAdminUser();

        $course = $this->getDataGenerator()->create_course(['shortname' => 'DD-REACT']);
        $user = $this->getDataGenerator()->create_and_enrol($course, 'student', ['username' => 'rstudent']);
        $smarturl = $this->getDataGenerator()->create_module('smarturl', [
            'course' => $course->id,
            'name' => 'React Stage Demo',
            'externalurl' => 'https://media.example.org/{{course_shortname}}?u={{user_username}}',
            'display_mode' => 'EMBED',
        ]);
        $cm = get_coursemodule_from_id('smarturl', $smarturl->cmid, 0, false, MUST_EXIST);
        $context = \context_module::instance($cm->id);
        $record = $DB->get_record('smarturl', ['id' => $smarturl->id], '*', MUST_EXIST);

        $PAGE->set_url('/mod/smarturl/view.php', ['id' => $cm->id]);
        $PAGE->set_context($context);
        $renderer = $PAGE->get_renderer('mod_smarturl');

        $page = new resource_page($record, $course, $cm, $context, $user);
        $this->assertSame('mod_smarturl/ResourceView', $page->get_react_component_name());
        $props = $page->get_react_component_props($renderer);
        $this->assertStringContainsString('https://media.example.org/DD-REACT?u=rstudent', $props->playerHtml);
        $rendered = $renderer->render($page);
        $this->assertStringContainsString('mod_smarturl/ResourceView', $rendered);

        $adminpage = new admin_config_page('categories');
        $this->assertSame('mod_smarturl/AdminConfig', $adminpage->get_react_component_name());
        $adminprops = $adminpage->get_react_component_props($renderer);
        $this->assertNotEmpty($adminprops->rows['fields']);
        $this->assertNotEmpty($adminprops->rows['variables']);
    }
}
