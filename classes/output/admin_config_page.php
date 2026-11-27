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
final class admin_config_page implements \core\output\named_templatable, \renderable {
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
     * Returns the catalogue template.
     *
     * @param \renderer_base $renderer Moodle renderer.
     * @return string
     */
    public function get_template_name(\renderer_base $renderer): string {
        return 'mod_smarturl/admin_config';
    }

    /**
     * Returns the catalogue data.
     *
     * @param \renderer_base $renderer Moodle renderer.
     * @return array
     */
    public function export_for_template(\renderer_base $renderer): array {
        $props = schema_catalogue::props($this->tab);
        return $props + ['payloadjson' => json_encode($props, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)];
    }
}
