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
use mod_smarturl\local\metadata\metadata_type_manager;

/**
 * Tests configurable metadata schemas and high-volume normalized metadata queries.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers \mod_smarturl\local\metadata\metadata_type_manager
 * @covers \mod_smarturl\local\metadata\metadata_repository
 */
final class metadata_manager_test extends \advanced_testcase {
    /**
     * Tests metadata type CRUD and storing/querying 60+ metadata entries efficiently.
     */
    public function test_high_volume_metadata_and_type_lifecycle(): void {
        global $DB;
        $this->resetAfterTest(true);

        $course = $this->getDataGenerator()->create_course();
        $smarturl = $this->getDataGenerator()->create_module('smarturl', ['course' => $course->id]);

        $customtype = metadata_type_manager::save([
            'shortname' => 'resolution_profile',
            'name' => 'Resolution Profile',
            'group_name' => 'Technical',
            'datatype' => 'BADGE',
            'display_priority' => 'PRIMARY',
        ]);
        $this->assertEquals('resolution_profile', $customtype->shortname);

        $hiddentype = metadata_type_manager::save([
            'shortname' => 'internal_checksum',
            'name' => 'Internal Checksum',
            'group_name' => 'Technical',
            'datatype' => 'TEXT',
            'display_priority' => 'HIDDEN',
        ]);

        $entries = [
            ['key' => 'category', 'value' => 'campus-capitulo IA'],
            ['key' => 'resolution_profile', 'value' => '1080p'],
            ['key' => $hiddentype->shortname, 'value' => 'sha256:abc'],
            ['key' => 'adhoc_custom_field', 'value' => 'Custom attribute value'],
        ];
        for ($i = 1; $i <= 60; $i++) {
            $entries[] = ['key' => "custom_attr_{$i}", 'value' => "Value {$i}"];
        }

        metadata_repository::replace_for_instance((int)$smarturl->id, $entries);

        $visible = metadata_repository::for_instance((int)$smarturl->id, false);
        $this->assertCount(63, $visible); // Excludes HIDDEN internal_checksum.

        $all = metadata_repository::for_instance((int)$smarturl->id, true);
        $this->assertCount(64, $all);

        // Deleting a type preserves existing stored values under custom_key.
        metadata_type_manager::delete((int)$customtype->id);
        $afterdelete = metadata_repository::for_instance((int)$smarturl->id, false);
        $keys = array_column($afterdelete, 'key');
        $this->assertContains('resolution_profile', $keys);
        $this->assertFalse($DB->record_exists('smarturl_meta_type', ['id' => $customtype->id]));
    }
}
