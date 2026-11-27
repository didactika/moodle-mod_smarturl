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
use mod_smarturl\local\policy\policy_manager;
use mod_smarturl\local\viewer_data;

/**
 * Renders the Smart URL viewer and high-volume metadata explorer via Mustache + AMD (Moodle 4.5 - 5.2).
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class resource_page implements named_templatable, \renderable {
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
        /** @var \stdClass Activity record. */
        private readonly \stdClass $smarturl,
        /** @var \stdClass Course record. */
        private readonly \stdClass $course,
        /** @var \cm_info|\stdClass Course module. */
        private readonly \cm_info|\stdClass $cm,
        /** @var \context_module Activity context. */
        private readonly \context_module $context,
        /** @var \stdClass Current user. */
        private readonly \stdClass $user,
    ) {
    }

    /**
     * Returns the Mustache template name.
     *
     * @param \renderer_base $renderer Renderer.
     * @return string
     */
    public function get_template_name(\renderer_base $renderer): string {
        return 'mod_smarturl/resource_view';
    }

    /**
     * Exports template variables and JSON state payload for Mustache + AMD hydration.
     *
     * @param \renderer_base $output Renderer.
     * @return array<string, mixed>
     */
    public function export_for_template(\renderer_base $output): array {
        $view = viewer_data::prepare($this->smarturl, $this->course, $this->user, $this->context);
        $canedit = has_capability('moodle/course:manageactivities', $this->context);
        $policy = $canedit ? policy_manager::get_by_cmid((int)$this->cm->id) : null;
        $displaymode = $view['mode'];
        $poster = $view['poster'];
        $locked = policy_manager::locked_fields($policy);
        $duration = $this->smarturl->duration_seconds !== null ? (int)$this->smarturl->duration_seconds : null;

        $displaylabels = [
            'AUTO' => 'Automatic',
            'EMBED' => 'Embedded on page',
            'INLINE_IFRAME' => 'Interactive preview',
            'MODAL' => 'Preview dialog',
            'POPUP' => 'Pop-up window',
            'NEW' => 'New browser tab',
            'OPEN' => 'Direct redirect',
            'CARD' => 'Preview card',
        ];

        $primarylabel = $displaymode === 'POPUP'
            ? get_string('launchpopup', 'smarturl')
            : get_string('openexternal', 'smarturl');

        $payload = [
            'cmid' => (int)$this->cm->id,
            'name' => $view['name'],
            'playable' => !empty($view['target']['playable']) || in_array($view['target']['kind'], ['video', 'audio'], true),
            'playerHtml' => viewer_data::render_target($view['target'], $view['name']),
            'goUrl' => (new \moodle_url('/mod/smarturl/go.php', ['id' => $this->cm->id, 'fromviewer' => 1]))->out(false),
            'displayMode' => $displaymode,
            'aspectRatio' => (string)($this->smarturl->aspect_ratio ?: '16:9'),
            'popupWidth' => (int)($this->smarturl->popup_width ?: 1200),
            'popupHeight' => (int)($this->smarturl->popup_height ?: 800),
            'strings' => [
                'playresource' => get_string('playresource', 'smarturl'),
                'openresource' => get_string('openexternal', 'smarturl'),
                'launchiframe' => get_string('launchiframe', 'smarturl'),
                'launchmodal' => get_string('launchmodal', 'smarturl'),
                'launchpopup' => get_string('launchpopup', 'smarturl'),
                'closepreview' => get_string('closepreview', 'smarturl'),
                'metadataheading' => get_string('metadataheading', 'smarturl'),
                'groupname' => get_string('groupname', 'smarturl'),
                'metadatatypes' => get_string('metadatatypes', 'smarturl'),
                'metavalue' => get_string('meta_value', 'smarturl'),
                'description' => get_string('description'),
                'metadatasearch' => get_string('metadatasearch', 'smarturl'),
                'metadatasearchplaceholder' => get_string('metadatasearchplaceholder', 'smarturl'),
                'allgroups' => get_string('allgroups', 'smarturl'),
                'clearfilters' => get_string('clearfilters', 'smarturl'),
                'viewcards' => get_string('viewcards', 'smarturl'),
                'viewtable' => get_string('viewtable', 'smarturl'),
                'emptymetadata' => get_string('emptymetadata', 'smarturl'),
                'emptymetadata_hint' => get_string('emptymetadata_hint', 'smarturl'),
                'showmore' => get_string('showmore', 'smarturl'),
                'showless' => get_string('showless', 'smarturl'),
            ],
        ];

        $durationlabel = null;
        if ($duration !== null && $duration > 0) {
            $mins = intdiv($duration, 60);
            $secs = $duration % 60;
            $durationlabel = $mins > 0 ? "{$mins}m {$secs}s" : "{$secs}s";
        }

        return [
            'cmid' => (int)$this->cm->id,
            'name' => $payload['name'],
            'intro' => $view['intro'],
            'playable' => !empty($view['target']['playable']) || in_array($view['target']['kind'], ['video', 'audio'], true),
            'playerhtml' => viewer_data::render_target($view['target'], $view['name']),
            'gourl' => $payload['goUrl'],
            'displaylabel' => $displaylabels[$displaymode] ?? $displaymode,
            'primarylabel' => $primarylabel,
            'isembed' => $displaymode === 'EMBED',
            'isinline' => $displaymode === 'INLINE_IFRAME',
            'ismodal' => $displaymode === 'MODAL',
            'isdirect' => !in_array($displaymode, ['EMBED', 'INLINE_IFRAME', 'MODAL'], true),
            'thumbnailurl' => $poster,
            'hasthumbnail' => !empty($poster),
            'durationlabel' => $durationlabel,
            'hasduration' => $durationlabel !== null,
            'managedby' => $policy->managed_by ?? '',
            'hasmanagedby' => !empty($policy->managed_by),
            'managedbadge' => get_string('managedbadge', 'smarturl'),
            'lockedcount' => count($locked),
            'haslocked' => count($locked) > 0,
            'lockedbadge' => get_string('lockedbadge', 'smarturl'),
            'strings' => $payload['strings'],
            'payloadjson' => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ];
    }
}
