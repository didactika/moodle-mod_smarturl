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
 * Site setting select with a help icon next to its name.
 *
 * Admin settings have no help button of their own, so the icon is placed after the label,
 * where Moodle forms put it. Inside the label, a click would focus the select and close the popover.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class help_select_setting extends \admin_setting_configselect {
    /** @var string Help string identifier in mod_smarturl. */
    private string $helpidentifier;

    /**
     * Creates the setting.
     *
     * @param string $name Setting name, including the plugin prefix.
     * @param string $visiblename Setting title.
     * @param string $description Short description shown below the setting.
     * @param string $defaultsetting Default value.
     * @param array $choices Option values and labels.
     * @param string $helpidentifier Identifier of the `_help` string in mod_smarturl.
     */
    public function __construct(
        string $name,
        string $visiblename,
        string $description,
        string $defaultsetting,
        array $choices,
        string $helpidentifier,
    ) {
        parent::__construct($name, $visiblename, $description, $defaultsetting, $choices);
        $this->helpidentifier = $helpidentifier;
    }

    /**
     * Renders the select and adds the help icon after its label.
     *
     * The label and icon share a flex row, so the icon is centred on the text and the row ends at the
     * same edge as the setting name below it. The icon's trailing margin, meant for forms where the field
     * follows, becomes a small gap before it.
     *
     * @param mixed $data Current value.
     * @param string $query Admin search.
     * @return string
     */
    public function output_html($data, $query = '') {
        global $OUTPUT;
        $html = parent::output_html($data, $query);
        $start = strpos($html, '<label');
        $end = $start === false ? false : strpos($html, '</label>', $start);
        if ($end === false) {
            return $html;
        }
        $end += strlen('</label>');
        $icon = preg_replace('/\bme-2\b/', 'ms-1', $OUTPUT->help_icon($this->helpidentifier, 'smarturl'), 1);
        $title = \html_writer::div(
            substr($html, $start, $end - $start) . $icon,
            'd-flex align-items-center justify-content-sm-end',
        );
        return substr($html, 0, $start) . $title . substr($html, $end);
    }
}
