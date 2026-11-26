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
use mod_smarturl\local\metadata\metadata_repository;
use mod_smarturl\local\policy\policy_manager;
use mod_smarturl\local\url\url_resolver;

/**
 * Renders the Smart URL viewer and high-volume metadata explorer via React (Moodle 5.3+).
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class resource_page implements react_component_renderable, \renderable {
    /**
     * Constructor.
     *
     * @param \stdClass $smarturl Activity instance record.
     * @param \stdClass $course Course record.
     * @param \cm_info|\stdClass $cm Course module.
     * @param \context_module $context Module context.
     * @param \stdClass $user Current user.
     */
    public function __construct(
        private readonly \stdClass $smarturl,
        private readonly \stdClass $course,
        private readonly \cm_info|\stdClass $cm,
        private readonly \context_module $context,
        private readonly \stdClass $user,
    ) {
    }

    /**
     * Component name mounted by core/react_autoinit.
     *
     * @return string
     */
    #[\Override]
    public function get_react_component_name(): string {
        return 'mod_smarturl/ResourceView';
    }

    /**
     * Initial props passed to ResourceView.tsx.
     *
     * @param \renderer_base $renderer Moodle renderer.
     * @return \stdClass
     */
    #[\Override]
    public function get_react_component_props(\renderer_base $renderer): \stdClass {
        $resolvedurl = url_resolver::resolve($this->smarturl, $this->course, $this->user, (int)$this->cm->id);
        $policy = policy_manager::get_by_cmid((int)$this->cm->id);
        $metadata = metadata_repository::for_instance((int)$this->smarturl->id, false);

        return (object)[
            'cmid' => (int)$this->cm->id,
            'courseid' => (int)$this->course->id,
            'courseurl' => (new \moodle_url('/course/view.php', ['id' => $this->course->id]))->out(false),
            'coursename' => format_string($this->course->fullname, true, ['context' => \context_course::instance($this->course->id)]),
            'name' => format_string($this->smarturl->name, true, ['context' => $this->context]),
            'intro' => format_module_intro('smarturl', $this->smarturl, (int)$this->cm->id),
            'resolvedUrl' => $resolvedurl,
            'goUrl' => (new \moodle_url('/mod/smarturl/go.php', ['id' => $this->cm->id]))->out(false),
            'displayMode' => (string)$this->smarturl->display_mode,
            'popupWidth' => (int)($this->smarturl->popup_width ?: 1200),
            'popupHeight' => (int)($this->smarturl->popup_height ?: 800),
            'aspectRatio' => (string)($this->smarturl->aspect_ratio ?: '16:9'),
            'thumbnailUrl' => $this->resolve_poster_url(),
            'durationSeconds' => $this->smarturl->duration_seconds !== null ? (int)$this->smarturl->duration_seconds : null,
            'policy' => [
                'managedBy' => $policy->managed_by ?? null,
                'lockedFields' => policy_manager::locked_fields($policy),
            ],
            'metadata' => $metadata,
            'strings' => [
                'openresource' => get_string('openresource', 'smarturl'),
                'launchiframe' => get_string('launchiframe', 'smarturl'),
                'closepreview' => get_string('closepreview', 'smarturl'),
                'metadataheading' => get_string('metadataheading', 'smarturl'),
                'metadatasearch' => get_string('metadatasearch', 'smarturl'),
                'metadatasearchplaceholder' => get_string('metadatasearchplaceholder', 'smarturl'),
                'allgroups' => get_string('allgroups', 'smarturl'),
                'clearfilters' => get_string('clearfilters', 'smarturl'),
                'viewcards' => get_string('viewcards', 'smarturl'),
                'viewtable' => get_string('viewtable', 'smarturl'),
                'copyjson' => get_string('copyjson', 'smarturl'),
                'copied' => get_string('copied', 'smarturl'),
                'emptymetadata' => get_string('emptymetadata', 'smarturl'),
                'emptymetadata_hint' => get_string('emptymetadata_hint', 'smarturl'),
                'showmore' => get_string('showmore', 'smarturl'),
                'showless' => get_string('showless', 'smarturl'),
                'managedbadge' => get_string('managedbadge', 'smarturl'),
                'lockedbadge' => get_string('lockedbadge', 'smarturl'),
            ],
        ];
    }

    /**
     * Resolves uploaded poster image URL or falls back to thumbnail_url.
     *
     * @return string|null
     */
    private function resolve_poster_url(): ?string {
        $fs = get_file_storage();
        $files = $fs->get_area_files($this->context->id, 'mod_smarturl', 'poster', 0, 'id DESC', false);
        if (!empty($files)) {
            $file = reset($files);
            return \moodle_url::make_pluginfile_url(
                $file->get_contextid(),
                $file->get_component(),
                $file->get_filearea(),
                $file->get_itemid(),
                $file->get_filepath(),
                $file->get_filename()
            )->out(false);
        }
        return !empty($this->smarturl->thumbnail_url) ? (string)$this->smarturl->thumbnail_url : null;
    }
}
