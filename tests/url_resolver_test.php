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

use mod_smarturl\local\metadata\param_def_manager;
use mod_smarturl\local\url\url_resolver;

/**
 * Tests dynamic URL parameter resolution across built-ins, user profile fields, course custom fields, and static params.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\PHPUnit\Framework\Attributes\CoversClass(\mod_smarturl\local\url\url_resolver::class)]
final class url_resolver_test extends \advanced_testcase {
    /**
     * Tests placeholder interpolation, query bindings, user profile fields, and course custom fields.
     */
    public function test_resolve_builtins_custom_fields_and_static_bindings(): void {
        global $CFG, $DB;
        $this->resetAfterTest(true);

        require_once($CFG->dirroot . '/user/profile/definelib.php');
        require_once($CFG->dirroot . '/user/profile/lib.php');

        // Custom user profile field.
        $catid = $DB->insert_record('user_info_category', (object)['name' => 'Extra', 'sortorder' => 1]);
        $DB->insert_record('user_info_field', (object)[
            'shortname' => 'campuscode',
            'name' => 'Campus Code',
            'datatype' => 'text',
            'categoryid' => $catid,
            'sortorder' => 1,
            'defaultdata' => 'UNIB',
        ]);

        // Custom course field.
        $cfcat = $this->getDataGenerator()->create_custom_field_category(['name' => 'Academic']);
        $cfield = $this->getDataGenerator()->create_custom_field([
            'categoryid' => $cfcat->get('id'),
            'shortname' => 'programcode',
            'name' => 'Program code',
            'type' => 'text',
        ]);

        $course = $this->getDataGenerator()->create_course([
            'shortname' => 'DD2793',
            'idnumber' => 'EXT-2793',
            'customfield_programcode' => 'MBA-2026',
        ]);
        $user = $this->getDataGenerator()->create_user(['username' => 'jdoe', 'email' => 'jdoe@example.org']);
        // Force non-default lang on the user record independent of installed PHPUnit lang packs.
        $user->lang = 'es';
        profile_save_data((object)['id' => $user->id, 'profile_field_campuscode' => 'UNEAT']);
        $this->getDataGenerator()->enrol_user($user->id, $course->id, 'editingteacher');

        param_def_manager::save([
            'shortname' => 'user_campus',
            'name' => 'User Campus Profile',
            'source_type' => 'USER_PROFILE_FIELD',
            'source_key' => 'campuscode',
        ]);
        param_def_manager::save([
            'shortname' => 'course_program',
            'name' => 'Course Program Custom Field',
            'source_type' => 'COURSE_CUSTOM_FIELD',
            'source_key' => 'programcode',
        ]);
        param_def_manager::save([
            'shortname' => 'tenant_env',
            'name' => 'Tenant env static',
            'source_type' => 'STATIC',
            'source_key' => 'prod',
        ]);

        $bindings = [
            ['param' => 'u', 'mode' => 'def', 'var' => 'user_username'],
            ['param' => 'prog', 'mode' => 'def', 'var' => 'course_program'],
            ['param' => 'campus', 'mode' => 'def', 'var' => 'user_campus'],
            ['param' => 'env', 'mode' => 'def', 'var' => 'tenant_env'],
            ['param' => 'roles', 'mode' => 'def', 'var' => 'user_roles'],
            ['param' => 'mode', 'mode' => 'static', 'value' => 'embedded'],
        ];

        $resolved = url_resolver::preview(
            'https://video.example.org/courses/{{course_idnumber}}/play/{{cm_id}}?lang={{user_lang}}#t=30',
            $bindings,
            $course,
            $user,
            42
        );

        $this->assertStringStartsWith('https://video.example.org/courses/EXT-2793/play/42?lang=es&', $resolved);
        $this->assertStringContainsString('u=jdoe', $resolved);
        $this->assertStringContainsString('prog=MBA-2026', $resolved);
        $this->assertStringContainsString('campus=UNEAT', $resolved);
        $this->assertStringContainsString('env=prod', $resolved);
        $this->assertStringContainsString('roles=editingteacher', $resolved);
        $this->assertStringContainsString('mode=embedded', $resolved);
        $this->assertStringEndsWith('#t=30', $resolved);
    }
}
