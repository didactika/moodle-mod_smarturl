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

use mod_smarturl\local\policy\availability_composer;
use mod_smarturl\local\policy\policy_manager;

/**
 * Tests external field-lock policies, admin restrictions, and two-branch availability composition.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \mod_smarturl\local\policy\policy_manager
 * @covers \mod_smarturl\local\policy\availability_composer
 * @covers ::smarturl_get_coursemodule_info
 */
final class policy_and_availability_test extends \advanced_testcase {
    /**
     * Tests composing and extracting two-branch availability trees cleanly.
     */
    public function test_two_branch_availability_compose_and_extract(): void {
        $managed = '{"op":"|","c":[{"type":"group","id":10}],"show":false}';
        $custom = '{"op":"&","c":[{"type":"date","d":">=","t":1800000000}],"showc":[true]}';

        $combined = availability_composer::compose($managed, $custom);
        $this->assertNotNull($combined);

        $decoded = json_decode($combined, true);
        $this->assertSame('&', $decoded['op']);
        $this->assertCount(2, $decoded['c']);
        $this->assertSame([false, true], $decoded['showc']);

        $extracted = availability_composer::extract_custom($combined, $managed);
        $this->assertSame(json_decode($custom, true), json_decode($extracted, true));
    }

    /**
     * Tests field lock enforcement and site administrator access.
     */
    public function test_policy_locks_and_admin_access(): void {
        global $DB;
        $this->resetAfterTest(true);

        $course = $this->getDataGenerator()->create_course();
        $smarturl = $this->getDataGenerator()->create_module('smarturl', ['course' => $course->id]);
        $context = \context_module::instance($smarturl->cmid);
        $teacher = $this->getDataGenerator()->create_and_enrol($course, 'editingteacher');
        $admin = get_admin();

        $policy = policy_manager::upsert_external((int)$smarturl->id, (int)$smarturl->cmid, [
            'managedby' => 'ekko',
            'externalkey' => 'ext-1',
            'lockedfields' => ['externalurl', 'completion'],
            'syncacknowledges' => true,
        ]);

        $this->assertFalse(policy_manager::can_edit_field('externalurl', $policy, $context, (int)$teacher->id));
        $this->assertFalse(policy_manager::can_edit_field('completion', $policy, $context, (int)$teacher->id));
        $this->assertTrue(policy_manager::can_edit_field('general', $policy, $context, (int)$teacher->id));

        $this->assertTrue(policy_manager::can_edit_field('externalurl', $policy, $context, (int)$admin->id));
        $this->assertTrue(policy_manager::can_edit_field('general', $policy, $context, (int)$admin->id));

        // Recording local override increments local_revision.
        $updated = policy_manager::record_local_override((int)$smarturl->id, (int)$smarturl->cmid, (int)$teacher->id, null);
        $this->assertSame(1, (int)$updated->local_revision);
        $this->assertSame(0, (int)$updated->acked_revision);
        $this->assertTrue($DB->record_exists('smarturl_policy', ['id' => $updated->id]));
    }

    /**
     * Tests MIME file icon guessing (.pdf, .mp4) and course-page launch behaviors for NEW and POPUP modes.
     */
    public function test_coursemodule_mime_icon_and_launch_behavior(): void {
        global $CFG, $DB;
        require_once($CFG->dirroot . '/mod/smarturl/lib.php');
        $this->resetAfterTest(true);

        $this->assertSame('f/pdf', smarturl_guess_icon('https://cdn.example.org/docs/guide.pdf?token={{user_id}}'));
        $this->assertNull(smarturl_guess_icon('https://example.org/portal/view'));

        $course = $this->getDataGenerator()->create_course();
        $pdfmod = $this->getDataGenerator()->create_module('smarturl', [
            'course' => $course->id,
            'externalurl' => 'https://cdn.example.org/syllabus.pdf',
            'display_mode' => 'NEW',
        ]);
        $cm = $DB->get_record('course_modules', ['id' => $pdfmod->cmid], '*', MUST_EXIST);
        $info = smarturl_get_coursemodule_info($cm);
        $this->assertNotFalse($info);
        $this->assertSame('f/pdf', $info->icon);
        $this->assertStringContainsString("'_blank'", (string)$info->onclick);
        $this->assertStringContainsString('/mod/smarturl/go.php?id=' . $pdfmod->cmid, (string)$info->onclick);
    }
}
