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

namespace mod_smarturl\local;

/**
 * Adds the design-system select menu to the site settings.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class settings_heading extends \admin_setting_heading {
    /**
     * Renders the settings heading and activates the select menus for this form.
     *
     * @param mixed $data Current settings.
     * @param string $query Admin search.
     * @return string
     */
    public function output_html($data, $query = '') {
        global $PAGE;
        $hook = $PAGE->get_renderer('mod_smarturl')->render(new \mod_smarturl\output\settings_controls());
        return $hook . parent::output_html($data, $query);
    }
}
