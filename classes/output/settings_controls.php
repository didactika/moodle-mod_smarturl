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

namespace mod_smarturl\output;

/**
 * Loads the Didactika controls in the site settings form.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class settings_controls implements \core\output\react_component_renderable, \renderable {
    /**
     * Returns the frontend entry point.
     *
     * @return string
     */
    public function get_react_component_name(): string {
        return 'mod_smarturl/SettingsControls';
    }

    /**
     * Returns the component properties.
     *
     * @param \renderer_base $renderer Moodle renderer.
     * @return \stdClass
     */
    public function get_react_component_props(\renderer_base $renderer): \stdClass {
        return new \stdClass();
    }
}
