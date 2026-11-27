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
 * Mounts the draft appearance controls in the activity form.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class preview_widget implements named_templatable, \renderable {
    /**
     * Creates a preview scoped to an editable activity or course.
     *
     * @param int $courseid Course ID.
     * @param int $cmid Course module ID, or zero.
     */
    public function __construct(
        /** @var int Course ID. */
        private readonly int $courseid,
        /** @var int Course module ID. */
        private readonly int $cmid,
    ) {
    }

    /**
     * Returns the entry point for the preview.
     *
     * @param \renderer_base $renderer Moodle renderer.
     * @return string
     */
    public function get_template_name(\renderer_base $renderer): string {
        return 'mod_smarturl/appearance_preview';
    }

    /**
     * Provides preview controls and scoped parameters.
     *
     * @param \renderer_base $renderer Moodle renderer.
     * @return array
     */
    public function export_for_template(\renderer_base $renderer): array {
        $languages = get_string_manager()->get_list_of_translations();
        return [
            'url' => (new \moodle_url('/mod/smarturl/preview.php'))->out(false),
            'courseid' => $this->courseid,
            'cmid' => $this->cmid,
            'sesskey' => sesskey(),
            'languages' => array_map(
                static fn($code, $name) => ['code' => $code, 'name' => $name],
                array_keys($languages),
                array_values($languages)
            ),
            'previewresource' => get_string('previewresource', 'smarturl'),
            'previewcourse' => get_string('previewcourse', 'smarturl'),
            'previewactivity' => get_string('previewactivity', 'smarturl'),
            'previewauxiliary' => get_string('previewauxiliary', 'smarturl'),
            'previewmobile' => get_string('previewmobile', 'smarturl'),
            'previewpending' => get_string('previewpending', 'smarturl'),
            'previewcurrentlanguage' => get_string('previewcurrentlanguage', 'smarturl'),
            'translationlanguage' => get_string('translationlanguage', 'smarturl'),
            'closepreview' => get_string('closepreview', 'smarturl'),
        ];
    }
}
