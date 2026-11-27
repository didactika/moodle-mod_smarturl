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

use mod_smarturl\local\migration\url_migrator;

/**
 * Tests selective event-emitting migration from mod_url to mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\local\migration\url_migrator::class)]
final class migration_service_test extends \advanced_testcase {
    /**
     * Tests that selective migration converts only matching URLs, migrates completions, rewires availability, and emits events.
     */
    public function test_selective_migration_preserves_completion_and_emits_events(): void {
        global $CFG, $DB;
        require_once($CFG->libdir . '/completionlib.php');

        $this->resetAfterTest(true);
        $this->setAdminUser();

        $course = $this->getDataGenerator()->create_course(['enablecompletion' => 1]);
        $student = $this->getDataGenerator()->create_and_enrol($course, 'student');

        // Two URLs: one managed by Ekko (idnumber prefix ekko-) and one manual teacher URL.
        $ekkourl = $this->getDataGenerator()->create_module('url', [
            'course' => $course->id,
            'name' => 'Ekko Video',
            'externalurl' => 'https://cdn.example.org/video/1',
            'completion' => COMPLETION_TRACKING_MANUAL,
        ], ['idnumber' => 'ekko-abc-123']);

        $manualurl = $this->getDataGenerator()->create_module('url', [
            'course' => $course->id,
            'name' => 'Manual Teacher Link',
            'externalurl' => 'https://example.org/manual',
        ], ['idnumber' => 'teacher-link']);

        // Mark Ekko URL completed for the student.
        $completion = new \completion_info($course);
        $ekkocm = get_fast_modinfo($course)->get_cm($ekkourl->cmid);
        $completion->update_state($ekkocm, COMPLETION_COMPLETE, (int)$student->id, true);

        // Downstream page depending on Ekko URL completion.
        $page = $this->getDataGenerator()->create_module('page', [
            'course' => $course->id,
            'name' => 'Follow-up Quiz Prep',
            'availability' => json_encode([
                'op' => '&',
                'c' => [['type' => 'completion', 'cm' => (int)$ekkourl->cmid, 'e' => 1]],
                'showc' => [true],
            ]),
        ]);

        // Dry run first.
        $dry = url_migrator::run([
            'courseid' => (int)$course->id,
            'idnumberprefix' => 'ekko-',
            'dryrun' => true,
        ]);
        $this->assertSame(1, $dry['matched']);
        $this->assertSame(0, $dry['migrated']);
        $this->assertSame(1, $dry['completions']);

        // Execute live migration and capture core Moodle events.
        $sink = $this->redirectEvents();
        $live = url_migrator::run([
            'courseid' => (int)$course->id,
            'idnumberprefix' => 'ekko-',
            'managedby' => 'ekko',
        ]);
        $events = $sink->get_events();
        $sink->close();

        $this->assertSame(1, $live['matched']);
        $this->assertSame(1, $live['migrated']);
        $this->assertSame(1, $live['completions']);
        $this->assertSame(1, $live['rewired']);

        $newcmid = $live['items'][0]['newcmid'];
        $this->assertNotEquals((int)$ekkourl->cmid, $newcmid);

        // Old Ekko URL gone, manual URL untouched.
        $this->assertFalse($DB->record_exists('course_modules', ['id' => $ekkourl->cmid]));
        $this->assertTrue($DB->record_exists('course_modules', ['id' => $manualurl->cmid]));

        // Student completion migrated cleanly onto new cmid.
        $newcomp = $DB->get_record('course_modules_completion', ['coursemoduleid' => $newcmid, 'userid' => $student->id]);
        $this->assertNotFalse($newcomp);
        $this->assertEquals(COMPLETION_COMPLETE, (int)$newcomp->completionstate);

        // Downstream availability now points to new cmid.
        $rewiredavail = json_decode((string)$DB->get_field('course_modules', 'availability', ['id' => $page->cmid]), true);
        $this->assertSame($newcmid, $rewiredavail['c'][0]['cm']);

        // Core Moodle events fired for Overwatch.
        $eventnames = array_map(static fn($e) => $e->eventname, $events);
        $this->assertContains('\\core\\event\\course_module_created', $eventnames);
        $this->assertContains('\\core\\event\\course_module_completion_updated', $eventnames);
        $this->assertContains('\\core\\event\\course_module_deleted', $eventnames);
    }
}
