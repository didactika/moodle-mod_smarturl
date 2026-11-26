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

use core\output\react_component_renderable;

/**
 * Renders the modern dynamic row builder inside mod_form on Moodle 5.3+.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class form_builder_widget implements react_component_renderable, \renderable {
    /**
     * Constructor.
     *
     * @param string $kind Builder mode (`params` or `metadata`).
     * @param array<int, array<string, mixed>> $initialrows Existing rows.
     * @param array<int, array<string, mixed>> $catalog Parameter definitions or metadata types.
     * @param bool $locked Whether editing is locked by permissions or policy.
     * @param array<string, string> $strings Localized UI strings.
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
     * React component mounted by core/react_autoinit.
     *
     * @return string
     */
    #[\Override]
    public function get_react_component_name(): string {
        return 'mod_smarturl/FormBuilder';
    }

    /**
     * Props serialized for FormBuilder.tsx.
     *
     * @param \renderer_base $renderer Moodle renderer.
     * @return \stdClass
     */
    #[\Override]
    public function get_react_component_props(\renderer_base $renderer): \stdClass {
        return (object)[
            'kind' => $this->kind,
            'initialRows' => array_values($this->initialrows),
            'catalog' => array_values($this->catalog),
            'locked' => $this->locked,
            'strings' => $this->strings,
        ];
    }
}
