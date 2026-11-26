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

use mod_smarturl\external\create_instances;
use mod_smarturl\external\delete_instances;
use mod_smarturl\external\get_instances;
use mod_smarturl\external\get_metadata;
use mod_smarturl\external\get_overrides;
use mod_smarturl\external\list_meta_types;
use mod_smarturl\external\list_param_defs;
use mod_smarturl\external\set_metadata;
use mod_smarturl\external\track_view;
use mod_smarturl\external\update_instances;
use mod_smarturl\local\policy\policy_manager;

/**
 * Tests Smart URL external web services.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class external_services_test extends \advanced_testcase {
    /**
     * Tests full WS lifecycle: create, get, update preserving custom availability, metadata query, track_view, overrides, delete.
     */
    public function test_external_lifecycle_roundtrip(): void {
        global $DB;
        $this->resetAfterTest(true);
        $this->setAdminUser();

        $course = $this->getDataGenerator()->create_course(['enablecompletion' => 1]);
        $user = $this->getDataGenerator()->create_and_enrol($course, 'student');

        $created = create_instances::execute([[
            'courseid' => (int)$course->id,
            'section' => 1,
            'name' => 'IA Chapter 1',
            'externalurl' => 'https://example.org/watch?u={{user_username}}',
            'idnumber' => 'ekko-item-1',
            'displaymode' => 'POPUP',
            'popupwidth' => 1200,
            'popupheight' => 800,
            'completion' => 2,
            'completionview' => 1,
            'managedavailability' => '{"op":"|","c":[{"type":"date","d":">=","t":1700000000}],"show":false}',
            'managedby' => 'ekko',
            'externalkey' => 'ext-item-1',
            'mandatory' => true,
            'lockedfields' => ['externalurl', 'display', 'completion'],
            'metadata' => [
                ['key' => 'category', 'value' => 'campus-capitulo IA'],
                ['key' => 'language', 'value' => 'es'],
                ['key' => 'custom_topic', 'value' => 'Architecture'],
            ],
        ]]);

        $this->assertCount(1, $created);
        $cmid = $created[0]['cmid'];
        $smarturlid = $created[0]['smarturlid'];

        $listed = get_instances::execute([(int)$course->id], 0, 10);
        $this->assertSame(1, $listed['total']);
        $this->assertFalse($listed['hasmore']);
        $this->assertCount(1, $listed['items']);
        $this->assertEquals('POPUP', $listed['items'][0]['displaymode']);
        $this->assertCount(3, $listed['items'][0]['metadata']);

        // Schema catalog endpoints support pagination cleanly.
        $mtypes = list_meta_types::execute(true, 0, 5);
        $this->assertGreaterThan(5, $mtypes['total']);
        $this->assertTrue($mtypes['hasmore']);
        $this->assertCount(5, $mtypes['items']);

        $pdefs = list_param_defs::execute(true, 0, 5);
        $this->assertGreaterThan(5, $pdefs['total']);
        $this->assertTrue($pdefs['hasmore']);
        $this->assertCount(5, $pdefs['items']);

        // Simulate a local course override on custom availability.
        policy_manager::record_local_override($smarturlid, $cmid, (int)$user->id, '{"op":"&","c":[{"type":"date","d":"<","t":1900000000}],"showc":[true]}');
        $overrides = get_overrides::execute((int)$course->id, 0, 10);
        $this->assertSame(1, $overrides['total']);
        $this->assertCount(1, $overrides['items']);
        $this->assertSame(1, $overrides['items'][0]['localrevision']);

        // External update preserves custom availability branch while acknowledging revision.
        $updated = update_instances::execute([[
            'cmid' => $cmid,
            'name' => 'IA Chapter 1 Updated',
            'managedavailability' => '{"op":"|","c":[{"type":"date","d":">=","t":1750000000}],"show":false}',
        ]]);
        $this->assertSame(1, $updated[0]['ackedrevision']);
        $this->assertSame(0, get_overrides::execute((int)$course->id)['total']);

        $avail = json_decode((string)$DB->get_field('course_modules', 'availability', ['id' => $cmid]), true);
        $this->assertSame('&', $avail['op']);
        $this->assertCount(2, $avail['c']);

        // Metadata filtering & merge/replace WS.
        $merged = set_metadata::execute($cmid, [['key' => 'reviewer', 'value' => 'QA Team']], 'merge');
        $this->assertSame(4, $merged['count']);

        $meta = get_metadata::execute($cmid, 'Architecture', 'Custom', 0, 10);
        $this->assertSame(1, $meta['total']);
        $this->assertFalse($meta['hasmore']);
        $this->assertSame('custom_topic', $meta['items'][0]['key']);

        // Track view completion WS as student.
        $this->setUser($user);
        $tracked = track_view::execute($cmid);
        $this->assertTrue($tracked['tracked']);

        $this->setAdminUser();
        $deleted = delete_instances::execute([$cmid]);
        $this->assertTrue($deleted[0]['deleted']);
        $this->assertSame(0, get_instances::execute([(int)$course->id])['total']);
    }
}
