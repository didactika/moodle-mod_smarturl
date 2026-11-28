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

use mod_smarturl\local\metadata\schema_catalogue;

/**
 * Renders the site-wide catalogue.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class admin_config_page implements \core\output\react_component_renderable, \renderable {
    /** @var string[] The Moodle icons the catalogue draws, besides the icon of each section. */
    private const ICONS = ['i/settings', 't/add', 'a/search', 'e/cancel', 'i/reload', 'i/previous', 'i/next', 't/edit', 't/delete'];

    /**
     * Selects the initial catalogue tab.
     *
     * @param string $tab Catalogue section.
     */
    public function __construct(
        /** @var string Current tab. */
        private readonly string $tab,
    ) {
    }

    /**
     * Returns the component mounted by Moodle.
     *
     * @return string
     */
    public function get_react_component_name(): string {
        return 'mod_smarturl/AdminConfig';
    }

    /**
     * Returns the catalogue data.
     *
     * @param \renderer_base $renderer Moodle renderer.
     * @return \stdClass
     */
    public function get_react_component_props(\renderer_base $renderer): \stdClass {
        $props = schema_catalogue::props($this->tab);
        $icons = ['monologo' => $renderer->pix_icon('monologo', '', 'mod_smarturl')];
        foreach (self::ICONS as $icon) {
            $icons[$icon] = $renderer->pix_icon($icon, '');
        }
        foreach ($props['sections'] as $section) {
            $icons[$section['icon']] ??= $renderer->pix_icon($section['icon'], '');
        }
        $props['icons'] = $icons;
        $props['strings'] += ['retry' => get_string('retry'), 'clear' => get_string('clear')];
        return (object)$props;
    }
}
