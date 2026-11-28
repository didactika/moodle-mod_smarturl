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
 * Renders a course preview that mounts the player after an intentional click.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class course_preview implements \core\output\react_component_renderable, \renderable {
    /**
     * Creates a course preview.
     *
     * @param int $cmid Activity ID.
     * @param string $player Moodle-generated player markup.
     */
    public function __construct(
        /** @var int Course module ID. */
        private readonly int $cmid,
        /** @var string Moodle-generated player markup. */
        private readonly string $player,
    ) {
    }

    /**
     * Returns the render entry point.
     * @return string
     */
    public function get_react_component_name(): string {
        return 'mod_smarturl/CoursePreview';
    }

    /**
     * Returns the authorised markup and control label.
     *
     * @param \renderer_base $renderer Active renderer.
     * @return \stdClass
     */
    public function get_react_component_props(\renderer_base $renderer): \stdClass {
        return (object)[
            'cmid' => $this->cmid,
            'label' => get_string('launchiframe', 'smarturl'),
            'player' => $this->player,
        ];
    }
}
