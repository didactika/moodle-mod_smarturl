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

namespace mod_smarturl\local\compat;

/**
 * Deletes, moves and reorders course modules consistently across Moodle 4.5 and 5.3+.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class course_module_actions {
    /**
     * Deletes a course module cleanly via core format actions (5.x) or course_delete_module (4.5).
     *
     * @param int $courseid Course ID.
     * @param int $cmid Course module ID.
     */
    public static function delete(int $courseid, int $cmid): void {
        global $CFG;

        if (class_exists(\core_courseformat\formatactions::class)) {
            $actions = \core_courseformat\formatactions::cm($courseid);
            if (method_exists($actions, 'delete')) {
                $actions->delete($cmid);
                return;
            }
        }

        require_once($CFG->dirroot . '/course/lib.php');
        course_delete_module($cmid);
    }

    /**
     * Moves a course module to the end of a target section.
     *
     * @param \stdClass $course Course record.
     * @param int $cmid Course module ID.
     * @param \section_info $section Target section.
     */
    public static function move_to_section(\stdClass $course, int $cmid, \section_info $section): void {
        global $CFG;

        if (class_exists(\core_courseformat\formatactions::class)) {
            $actions = \core_courseformat\formatactions::cm($course->id);
            if (method_exists($actions, 'move_end_section')) {
                $actions->move_end_section($cmid, $section->id);
                return;
            }
        }

        require_once($CFG->dirroot . '/course/lib.php');
        moveto_module(get_fast_modinfo($course)->get_cm($cmid), $section);
    }

    /**
     * Sets visibility on a course module.
     *
     * @param int $courseid Course ID.
     * @param int $cmid Course module ID.
     * @param int $visible 1 for visible, 0 for hidden.
     */
    public static function set_visible(int $courseid, int $cmid, int $visible): void {
        global $CFG;

        if (class_exists(\core_courseformat\formatactions::class)) {
            $actions = \core_courseformat\formatactions::cm($courseid);
            if (method_exists($actions, 'set_visibility')) {
                $actions->set_visibility($cmid, $visible);
                return;
            }
        }

        require_once($CFG->dirroot . '/course/lib.php');
        set_coursemodule_visible($cmid, $visible);
    }
}
