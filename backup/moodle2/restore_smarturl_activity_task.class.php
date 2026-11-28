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

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/mod/smarturl/backup/moodle2/restore_smarturl_stepslib.php');

/**
 * Restore task for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class restore_smarturl_activity_task extends restore_activity_task {
    /**
     * Defines task settings.
     */
    protected function define_my_settings(): void {
    }

    /**
     * Adds structure step.
     */
    protected function define_my_steps(): void {
        $this->add_step(new restore_smarturl_activity_structure_step('smarturl_structure', 'smarturl.xml'));
    }

    /**
     * Defines content decode rules.
     *
     * @return array
     */
    public static function define_decode_contents(): array {
        return [new restore_decode_content('smarturl', ['intro'], 'smarturl')];
    }

    /**
     * Defines URL decode rules.
     *
     * @return array
     */
    public static function define_decode_rules(): array {
        return [
            new restore_decode_rule('SMARTURLINDEX', '/mod/smarturl/index.php?id=$1', 'course'),
            new restore_decode_rule('SMARTURLVIEWBYID', '/mod/smarturl/view.php?id=$1', 'course_module'),
            new restore_decode_rule('SMARTURLVIEWBYS', '/mod/smarturl/view.php?s=$1', 'smarturl'),
        ];
    }
}
