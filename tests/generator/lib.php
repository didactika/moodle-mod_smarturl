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

/**
 * Data generator for mod_smarturl PHPUnit and Behat tests.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_smarturl_generator extends testing_module_generator {
    /**
     * Creates a Smart URL activity instance in a test course.
     *
     * @param \stdClass|array|null $record Instance fields.
     * @param array|null $options Module creation options.
     * @return \stdClass Created instance with cmid property.
     */
    public function create_instance($record = null, ?array $options = null): \stdClass {
        $record = (object)(array)$record;

        if (!isset($record->externalurl)) {
            $record->externalurl = 'https://example.org/resource/{{course_shortname}}';
        }
        if (!isset($record->display_mode)) {
            $record->display_mode = 'AUTO';
        }
        if (!isset($record->popup_width)) {
            $record->popup_width = 1200;
        }
        if (!isset($record->popup_height)) {
            $record->popup_height = 800;
        }
        if (!isset($record->aspect_ratio)) {
            $record->aspect_ratio = '16:9';
        }

        return parent::create_instance($record, (array)$options);
    }
}
