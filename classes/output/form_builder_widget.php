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

use core\output\named_templatable;

/**
 * Renders the modern dynamic row builder inside mod_form via Mustache + AMD (Moodle 4.5 - 5.2).
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class form_builder_widget implements named_templatable, \renderable {
    /**
     * Constructor.
     *
     * @param string $kind Builder mode (`params` or `metadata`).
     * @param array $initialrows Existing rows.
     * @param array $catalog Parameter definitions or metadata types.
     * @param bool $locked Whether editing is locked by permissions or policy.
     * @param array $strings Localized UI strings.
     */
    public function __construct(
        /** @var string Type of form rows. */
        private readonly string $kind,
        /** @var array Initially configured rows. */
        private readonly array $initialrows,
        /** @var array Available field definitions. */
        private readonly array $catalog,
        /** @var bool Whether editing is restricted. */
        private readonly bool $locked,
        /** @var array Localised control labels. */
        private readonly array $strings,
    ) {
    }

    /**
     * Mustache template name.
     *
     * @param \renderer_base $renderer Renderer.
     * @return string
     */
    public function get_template_name(\renderer_base $renderer): string {
        return 'mod_smarturl/form_builder';
    }

    /**
     * Exports JSON configuration for AMD form builder initialization.
     *
     * @param \renderer_base $output Renderer.
     * @return array<string, mixed>
     */
    public function export_for_template(\renderer_base $output): array {
        $payload = [
            'kind' => $this->kind,
            'initialRows' => array_values($this->initialrows),
            'catalog' => array_values($this->catalog),
            'locked' => $this->locked,
            'strings' => $this->strings,
        ];
        return [
            'kind' => $this->kind,
            'payloadjson' => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ];
    }
}
