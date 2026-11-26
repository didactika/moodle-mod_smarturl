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

/**
 * Library functions for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

use mod_smarturl\completion\rule_registry;
use mod_smarturl\local\activity_content;
use mod_smarturl\local\metadata\metadata_repository;
use mod_smarturl\local\presentation;
use mod_smarturl\local\viewer_data;
use mod_smarturl\local\url\resource_target;
use mod_smarturl\local\policy\availability_composer;
use mod_smarturl\local\policy\policy_manager;

/**
 * Declares features supported by mod_smarturl.
 *
 * @param string $feature FEATURE_* constant.
 * @return mixed True/false/constant or null if unknown.
 */
function smarturl_supports(string $feature) {
    switch ($feature) {
        case FEATURE_MOD_ARCHETYPE:
            return MOD_ARCHETYPE_RESOURCE;
        case FEATURE_GROUPS:
            return false;
        case FEATURE_GROUPINGS:
            return false;
        case FEATURE_MOD_INTRO:
            return true;
        case FEATURE_COMPLETION_TRACKS_VIEWS:
            return true;
        case FEATURE_COMPLETION_HAS_RULES:
            return true;
        case FEATURE_GRADE_HAS_GRADE:
            return false;
        case FEATURE_GRADE_OUTCOMES:
            return false;
        case FEATURE_BACKUP_MOODLE2:
            return true;
        case FEATURE_SHOW_DESCRIPTION:
            return true;
        default:
            if (defined('FEATURE_MOD_PURPOSE') && $feature === FEATURE_MOD_PURPOSE && defined('MOD_PURPOSE_CONTENT')) {
                return MOD_PURPOSE_CONTENT;
            }
            return null;
    }
}

/**
 * Adds a new Smart URL instance.
 *
 * @param \stdClass $data Form or API data.
 * @param mixed $mform Optional form instance.
 * @return int Newly created instance ID.
 */
function smarturl_add_instance(\stdClass $data, $mform = null): int {
    global $DB;

    $now = time();
    $record = (object)[
        'course' => (int)$data->course,
        'name' => trim((string)$data->name),
        'intro' => (string)($data->intro ?? ''),
        'introformat' => (int)($data->introformat ?? FORMAT_HTML),
        'externalurl' => resource_target::normalise((string)$data->externalurl, true),
        'display_mode' => strtoupper((string)($data->display_mode ?? get_config('mod_smarturl', 'defaultdisplay') ?: 'AUTO')),
        'popup_width' => !empty($data->popup_width) ? (int)$data->popup_width : ((int)get_config(
            'mod_smarturl',
            'defaultpopupwidth',
        ) ?: 1200),
        'popup_height' => !empty($data->popup_height) ? (int)$data->popup_height : ((int)get_config(
            'mod_smarturl',
            'defaultpopupheight',
        ) ?: 800),
        'aspect_ratio' => !empty($data->aspect_ratio) ? (string)$data->aspect_ratio : '16:9',
        'show_description' => (int)!empty($data->showdescription),
        'thumbnail_url' => !empty($data->thumbnail_url) ? trim((string)$data->thumbnail_url) : null,
        'duration_seconds' => isset($data->duration_seconds) && $data->duration_seconds !== ''
            ? (int)$data->duration_seconds : null,
        'parameters_json' => smarturl_extract_parameters_json($data),
        'presentation_json' => presentation::from_submission($data),
        'translations_json' => activity_content::from_submission($data),
        'completion_custom_json' => smarturl_extract_custom_completion_json($data, $mform),
        'timemodified' => $now,
    ];

    $id = $DB->insert_record('smarturl', $record);

    if (!empty($data->coursemodule)) {
        $cmid = (int)$data->coursemodule;
        $context = \context_module::instance($cmid);
        if ($mform && property_exists($data, 'smu_language')) {
            $DB->set_field(
                'smarturl',
                'translations_json',
                activity_content::from_submission($data, null, $context),
                ['id' => $id],
            );
        }
        if ($mform && !empty($data->poster_filemanager)) {
            file_save_draft_area_files(
                $data->poster_filemanager,
                $context->id,
                'mod_smarturl',
                'poster',
                0,
                ['subdirs' => 0, 'maxfiles' => 1]
            );
        }
        $DB->set_field('smarturl_policy', 'cmid', $cmid, ['smarturlid' => $id]);
    }

    metadata_repository::replace_for_instance($id, smarturl_extract_metadata_entries($data));

    return $id;
}

/**
 * Updates an existing Smart URL instance, respecting external policy locks and 2-branch availability.
 *
 * @param \stdClass $data Form or API data.
 * @param mixed $mform Optional form instance.
 * @return bool True on success.
 */
function smarturl_update_instance(\stdClass $data, $mform = null): bool {
    global $DB, $USER;

    $id = (int)$data->instance;
    $existing = $DB->get_record('smarturl', ['id' => $id], '*', MUST_EXIST);
    $cmid = (int)($data->coursemodule ?? 0);
    $policy = $cmid > 0 ? policy_manager::get_by_cmid($cmid) : policy_manager::get_by_smarturlid($id);
    $context = $cmid > 0 ? \context_module::instance($cmid) : \context_course::instance((int)$existing->course);

    $can = static fn(string $field): bool => empty($data->_skippolicycheck)
        ? policy_manager::can_edit_field($field, $policy, $context, (int)$USER->id)
        : true;

    $record = clone $existing;
    $record->timemodified = time();

    if ($can('general')) {
        $record->name = trim((string)($data->name ?? $existing->name));
        $record->intro = (string)($data->intro ?? $existing->intro);
        $record->introformat = (int)($data->introformat ?? $existing->introformat);
        $record->show_description = isset($data->showdescription)
            ? (int)!empty($data->showdescription) : $existing->show_description;
        $record->translations_json = activity_content::from_submission(
            $data,
            $existing,
            $mform && $context instanceof \context_module ? $context : null
        );
        if (property_exists($data, 'thumbnail_url')) {
            $record->thumbnail_url = !empty($data->thumbnail_url) ? trim((string)$data->thumbnail_url) : null;
        }
    }

    if ($can('externalurl')) {
        if (isset($data->externalurl)) {
            $record->externalurl = resource_target::normalise((string)$data->externalurl, true);
        }
        $record->parameters_json = smarturl_extract_parameters_json($data, $existing->parameters_json);
    }

    if ($can('display')) {
        $record->presentation_json = presentation::from_submission($data, $existing);
        if (isset($data->display_mode)) {
            $record->display_mode = strtoupper((string)$data->display_mode);
        }
        if (isset($data->popup_width)) {
            $record->popup_width = (int)$data->popup_width ?: 1200;
        }
        if (isset($data->popup_height)) {
            $record->popup_height = (int)$data->popup_height ?: 800;
        }
        if (isset($data->aspect_ratio)) {
            $record->aspect_ratio = (string)$data->aspect_ratio ?: '16:9';
        }
        if (property_exists($data, 'duration_seconds')) {
            $record->duration_seconds = ($data->duration_seconds !== '' && $data->duration_seconds !== null)
                ? (int)$data->duration_seconds
                : null;
        }
    }

    if ($can('completion')) {
        $customjson = smarturl_extract_custom_completion_json($data, $mform, $existing->completion_custom_json);
        $record->completion_custom_json = $customjson;
    }

    $DB->update_record('smarturl', $record);

    if ($can('general') && $mform && $cmid > 0 && !empty($data->poster_filemanager)) {
        file_save_draft_area_files(
            $data->poster_filemanager,
            $context->id,
            'mod_smarturl',
            'poster',
            0,
            ['subdirs' => 0, 'maxfiles' => 1]
        );
    }

    if ($can('metadata')) {
        $entries = smarturl_extract_metadata_entries($data, true);
        if ($entries !== null) {
            metadata_repository::replace_for_instance($id, $entries);
        }
    }

    if (empty($data->_skippolicycheck) && $cmid > 0) {
        $cm = $DB->get_record('course_modules', ['id' => $cmid], 'id, course, availability');
        if ($cm && $policy !== null) {
            $managedavail = $policy->managed_availability_json;
            $newavail = $cm->availability;
            if (!empty($managedavail) && !policy_manager::can_edit_field('availability', $policy, $context, (int)$USER->id)) {
                $newavail = availability_composer::compose($managedavail, $policy->custom_availability_json);
                $DB->set_field('course_modules', 'availability', $newavail, ['id' => $cmid]);
            } else if (!empty($managedavail) && !has_capability('mod/smarturl:overrideavailability', $context)) {
                $custombranch = availability_composer::extract_custom($cm->availability, $managedavail);
                $combined = availability_composer::compose($managedavail, $custombranch);
                $DB->set_field('course_modules', 'availability', $combined, ['id' => $cmid]);
                policy_manager::record_local_override($id, $cmid, (int)$USER->id, $custombranch);
            } else {
                policy_manager::record_local_override($id, $cmid, (int)$USER->id, $cm->availability);
            }

            if (!empty($policy->managed_by)) {
                $updatedpolicy = policy_manager::get_by_cmid($cmid);
                $event = \mod_smarturl\event\resource_overridden::create([
                    'objectid' => $id,
                    'context' => \context_module::instance($cmid),
                    'courseid' => (int)$record->course,
                    'other' => [
                        'cmid' => $cmid,
                        'managedby' => (string)$policy->managed_by,
                        'externalkey' => (string)($policy->external_key ?? ''),
                        'localrevision' => $updatedpolicy ? (int)$updatedpolicy->local_revision : 1,
                    ],
                ]);
                $event->trigger();
            }
        }
    }

    return true;
}

/**
 * Deletes a Smart URL instance and all related metadata/policy rows.
 *
 * @param int $id Instance ID.
 * @return bool True if deleted.
 */
function smarturl_delete_instance(int $id): bool {
    global $DB;

    if (!$DB->record_exists('smarturl', ['id' => $id])) {
        return false;
    }

    $DB->delete_records('smarturl_meta_value', ['smarturlid' => $id]);
    $DB->delete_records('smarturl_policy', ['smarturlid' => $id]);
    $DB->delete_records('smarturl', ['id' => $id]);

    return true;
}

/**
 * Guesses a Moodle core MIME file-type icon (e.g. PDF, video, document) from the external URL.
 *
 * Returns null for generic pages, directory URLs, or unknown extensions so the module icon is used.
 *
 * @param string $rawurl External URL or template.
 * @return string|null Icon identifier accepted by cached_cm_info::$icon.
 */
function smarturl_guess_icon(string $rawurl): ?string {
    global $CFG;
    require_once($CFG->libdir . '/filelib.php');

    $cleanurl = preg_replace('/\{\{[a-z0-9_.-]+\}\}/i', 'token', trim($rawurl));
    if ($cleanurl === '' || substr_count($cleanurl, '/') < 3 || substr($cleanurl, -1) === '/') {
        return null;
    }

    try {
        $moodleurl = new \moodle_url($cleanurl);
        $cleanurl = $moodleurl->out_omit_querystring();
    } catch (\moodle_exception $e) {
        return null;
    }

    $icon = file_extension_icon($cleanurl);
    $htmlicon = file_extension_icon('.htm');
    $unknownicon = file_extension_icon('');
    $phpicon = file_extension_icon('.php');

    if ($icon === $unknownicon || $icon === $htmlicon || $icon === $phpicon) {
        return null;
    }

    return $icon;
}

/**
 * Checks whether an external URL is likely suitable for inline embedding under AUTO mode.
 *
 * @param string $rawurl External URL or template.
 * @return bool
 */
function smarturl_is_embeddable_url(string $rawurl): bool {
    $lower = strtolower(trim($rawurl));
    return (bool)preg_match('/\.(mp4|webm|ogg|m3u8|pdf)(\?.*|#.*)?$/i', $lower)
        || str_contains($lower, 'youtube.com')
        || str_contains($lower, 'youtu.be')
        || str_contains($lower, 'vimeo.com')
        || str_contains($lower, '/embed');
}

/**
 * Populates cached course module information including MIME icon, launch behaviour, and completion rules.
 *
 * @param \stdClass $coursemodule Course module DB record.
 * @return cached_cm_info|false
 */
function smarturl_get_coursemodule_info(\stdClass $coursemodule) {
    global $DB;

    $smarturl = $DB->get_record(
        'smarturl',
        ['id' => $coursemodule->instance],
        'id, name, intro, introformat, externalurl, display_mode, popup_width, popup_height, duration_seconds, ' .
            'completion_custom_json, presentation_json, translations_json'
    );
    if (!$smarturl) {
        return false;
    }

    $info = new cached_cm_info();
    $info->name = $smarturl->name;
    $usemimeicons = get_config('mod_smarturl', 'usemimeicons');
    $info->icon = $usemimeicons === false || $usemimeicons ? smarturl_guess_icon((string)$smarturl->externalurl) : null;

    $profile = presentation::for_instance($smarturl);
    if (empty($smarturl->presentation_json) && !empty($coursemodule->showdescription)) {
        $info->content = format_module_intro('smarturl', $smarturl, $coursemodule->id, false);
    }

    $custom = [
        'display_mode' => $smarturl->display_mode,
        'filtericon' => true,
        'titles' => array_map(static fn($translation) => $translation['title'], activity_content::translations($smarturl)),
    ];
    if (!empty($smarturl->completion_custom_json)) {
        $decoded = json_decode((string)$smarturl->completion_custom_json, true);
        if (is_array($decoded)) {
            $custom['customcompletionrules'] = $decoded;
        }
    }
    $info->customdata = $custom;
    $classes = [];
    if (!$profile['icon'] || $profile['course'] === 'IMAGE') {
        $classes[] = 'smu-hide-course-icon';
    }
    if (!$profile['title'] || $profile['course'] === 'IMAGE') {
        $classes[] = 'smu-hide-course-title';
    }
    $info->extraclasses = implode(' ', $classes);

    $gourl = (new moodle_url('/mod/smarturl/go.php', ['id' => $coursemodule->id]))->out(false);
    if ($profile['launch'] === 'VIEWERTAB' || $profile['launch'] === 'VIEWERWINDOW') {
        $gourl = (new moodle_url('/mod/smarturl/view.php', ['id' => $coursemodule->id, 'aux' => 1]))->out(false);
    }
    if (in_array($profile['launch'], ['EXTERNALWINDOW', 'VIEWERWINDOW'], true)) {
        $w = (int)($smarturl->popup_width ?: 1200);
        $h = (int)($smarturl->popup_height ?: 800);
        $info->onclick = "window.open('{$gourl}', 'smarturl{$coursemodule->id}', 'width={$w},height={$h}," .
            "toolbar=no,location=no,menubar=no,scrollbars=yes,resizable=yes'); return false;";
    } else if (in_array($profile['launch'], ['EXTERNALTAB', 'VIEWERTAB'], true)) {
        $info->onclick = "window.open('{$gourl}', '_blank', 'noopener'); return false;";
    }

    return $info;
}

/**
 * Adapts the module name and presentation to the active view of a course.
 *
 * @param cm_info $cm Course module.
 */
function smarturl_cm_info_dynamic(cm_info $cm): void {
    $data = (array)$cm->customdata;
    if (!empty($data['titles'][current_language()])) {
        $cm->set_name($data['titles'][current_language()]);
    }
}

/**
 * Enhances the course activity card according to display mode, primary metadata, and preview controls.
 *
 * @param cm_info $cm Course module info.
 */
function smarturl_cm_info_view(cm_info $cm): void {
    global $DB, $COURSE, $USER;

    if (!$cm->uservisible || !has_capability('mod/smarturl:view', $cm->context)) {
        return;
    }
    static $resources = [];
    static $metadata = [];
    if (!isset($resources[$cm->course])) {
        $resources[$cm->course] = $DB->get_records('smarturl', ['course' => $cm->course]);
        $metadata[$cm->course] = metadata_repository::for_instances(array_keys($resources[$cm->course]));
    }
    $instance = $resources[$cm->course][$cm->instance] ?? null;
    if (!$instance) {
        return;
    }
    $profile = presentation::for_instance($instance);
    $name = activity_content::title($instance);
    $fields = $profile['course'] === 'IMAGE' ? [] : presentation::select_fields(
        $metadata[$cm->course][$cm->instance] ?? [],
        $profile['coursefields'],
        true
    );
    $viewurl = new moodle_url('/mod/smarturl/view.php', ['id' => $cm->id]);
    $detailsurl = new moodle_url($viewurl, ['forceview' => 1]);
    $attributes = [];
    $launch = $profile['launch'];
    $action = match ($launch) {
        'VIEWERTAB', 'VIEWERWINDOW' => new moodle_url($viewurl, ['aux' => 1]),
        'EXTERNAL', 'EXTERNALTAB', 'EXTERNALWINDOW' => new moodle_url('/mod/smarturl/go.php', ['id' => $cm->id]),
        default => $viewurl,
    };
    if (in_array($launch, ['VIEWERTAB', 'VIEWERWINDOW', 'EXTERNALTAB', 'EXTERNALWINDOW'], true)) {
        $attributes += ['target' => '_blank', 'rel' => 'noopener noreferrer'];
    }
    if (in_array($launch, ['VIEWERWINDOW', 'EXTERNALWINDOW'], true)) {
        $width = max(320, min(2400, (int)$instance->popup_width));
        $height = max(240, min(1600, (int)$instance->popup_height));
        $attributes['onclick'] = "const viewer = window.open('', '_blank', 'popup,width={$width},height={$height}');"
            . "if (viewer) { viewer.opener = null; viewer.location.href = this.href; return false; } return true;";
    }
    $actionlabel = in_array($launch, ['VIEWERTAB', 'VIEWERWINDOW', 'EXTERNALTAB', 'EXTERNALWINDOW'], true)
        ? get_string('launch_' . strtolower($launch), 'smarturl')
        : get_string('openactivity', 'smarturl');
    $badges = [];
    foreach ($fields as $entry) {
        $badges[] = html_writer::span(
            s($entry['label'] . ': ' . $entry['value']),
            'badge bg-light text-dark border rounded-pill',
        );
    }
    $parts = [];
    if ($profile['course'] !== 'LINK' || $launch === 'INLINE') {
        $course = (int)$COURSE->id === (int)$instance->course ? $COURSE : $DB->get_record('course', ['id' => $cm->course]);
        try {
            $target = viewer_data::target($instance, $course, $USER, (int)$cm->id, $profile);
        } catch (\invalid_parameter_exception) {
            $target = ['kind' => 'link', 'poster' => null];
        }
        $poster = viewer_data::poster($instance, $cm->context, $profile['poster'], $target['poster']);
        if ($profile['course'] !== 'LINK') {
            $picture = $poster ? html_writer::empty_tag('img', [
                'src' => $poster, 'class' => 'smu-course-cover', 'alt' => '', 'loading' => 'lazy',
            ]) : '';
            $media = !empty($target['playable']) || in_array($target['kind'], ['media', 'video', 'audio'], true);
            if ($picture && $profile['play'] && $media) {
                global $OUTPUT;
                $play = $OUTPUT->pix_icon('i/play', '') . html_writer::span(get_string('playresource', 'smarturl'));
                $picture = html_writer::div(
                    $picture . html_writer::span($play, 'btn btn-primary smu-play-overlay'),
                    'position-relative',
                );
            }
            if ($picture) {
                $parts[] = html_writer::link($action, $picture, $attributes + ['aria-label' => $name . ' · ' . $actionlabel]);
            }
            if ($profile['course'] === 'CARD' || !$picture) {
                $buttons = html_writer::link($action, $actionlabel, $attributes + ['class' => 'btn btn-primary btn-sm']);
                $buttons .= html_writer::link(
                    $detailsurl,
                    get_string('viewdetails', 'smarturl'),
                    ['class' => 'btn btn-outline-secondary btn-sm']
                );
                $parts[] = html_writer::div(implode(' ', $badges) .
                    html_writer::div($buttons, 'd-flex flex-wrap smu-course-actions'), 'smu-course-card-body');
            }
        }
        if ($launch === 'INLINE' && $target['kind'] !== 'link') {
            $embed = viewer_data::render_target(resource_target::with_markup($target, $name), $name);
            global $OUTPUT;
            $preview = new \mod_smarturl\output\course_preview((int)$cm->id, $embed);
            $parts[] = $OUTPUT->render($preview);
        }
    } else if ($badges) {
        $badges[] = html_writer::link($detailsurl, get_string('viewdetails', 'smarturl'), ['class' => 'smu-course-meta-link']);
        $parts[] = html_writer::div(implode(' ', $badges), 'mod-smarturl-course-pills');
    }
    if ($profile['description'] && $profile['course'] !== 'IMAGE' && !empty($instance->presentation_json)) {
        $intro = activity_content::description($instance, $cm->context, (int)$cm->id);
        if ($intro !== '') {
            $parts[] = html_writer::div($intro, 'smu-course-description');
        }
    }
    if ($parts) {
        $cm->set_after_link(html_writer::div(implode('', $parts), 'smu-course-presentation'));
    }
}

/**
 * Serves uploaded poster files for Smart URL activities.
 *
 * @param \stdClass $course Course record.
 * @param \stdClass $cm Course module record.
 * @param \context $context Context.
 * @param string $filearea File area.
 * @param array $args File path args.
 * @param bool $forcedownload Force download.
 * @param array $options Additional options.
 * @return bool
 */
function smarturl_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload, array $options = []): bool {
    if ($context->contextlevel !== CONTEXT_MODULE || !in_array($filearea, ['poster', 'translation'], true)) {
        return false;
    }
    require_login($course, true, $cm);
    require_capability('mod/smarturl:view', $context);

    $itemid = array_shift($args);
    $filename = array_pop($args);
    $filepath = $args ? '/' . implode('/', $args) . '/' : '/';

    $fs = get_file_storage();
    $file = $fs->get_file($context->id, 'mod_smarturl', $filearea, (int)$itemid, $filepath, $filename);
    if (!$file || $file->is_directory()) {
        return false;
    }
    send_stored_file($file, null, 0, $forcedownload, $options);
    return true;
}

/**
 * Marks a Smart URL as viewed and fires Moodle core events/completion.
 *
 * @param \stdClass $smarturl Instance record.
 * @param \stdClass $course Course record.
 * @param \cm_info|\stdClass $cm Course module.
 * @param \context_module $context Module context.
 */
function smarturl_view(\stdClass $smarturl, \stdClass $course, $cm, \context_module $context): void {
    $event = \mod_smarturl\event\course_module_viewed::create([
        'objectid' => $smarturl->id,
        'context' => $context,
    ]);
    $event->add_record_snapshot('course_modules', $cm);
    $event->add_record_snapshot('course', $course);
    $event->add_record_snapshot('smarturl', $smarturl);
    $event->trigger();

    $completion = new completion_info($course);
    $completion->set_module_viewed($cm);
}

/**
 * Extracts dynamic URL parameter bindings from form data or preserves raw JSON when supplied via API.
 *
 * @param \stdClass $data Input data.
 * @param string|null $fallback Existing JSON.
 * @return string|null JSON array or null.
 */
function smarturl_extract_parameters_json(\stdClass $data, ?string $fallback = null): ?string {
    if (isset($data->parameters_json)) {
        return $data->parameters_json ?: null;
    }

    $bindings = [];
    for ($i = 0; $i < 25; $i++) {
        $pfield = "param_name_{$i}";
        $vfield = "param_var_{$i}";
        $sfield = "param_static_{$i}";
        if (!property_exists($data, $pfield)) {
            continue;
        }
        $pname = trim((string)($data->$pfield ?? ''));
        if ($pname === '') {
            continue;
        }
        $selected = trim((string)($data->$vfield ?? ''));
        $staticval = trim((string)($data->$sfield ?? ''));
        if ($selected === '__static__') {
            $bindings[] = ['param' => $pname, 'mode' => 'static', 'var' => '', 'value' => $staticval];
        } else if ($selected !== '') {
            $bindings[] = ['param' => $pname, 'mode' => 'def', 'var' => $selected, 'value' => ''];
        }
    }

    if (!empty($bindings)) {
        return json_encode($bindings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    return property_exists($data, 'param_name_0') ? null : $fallback;
}

/**
 * Extracts metadata rows from form data or returns null if form metadata fields are absent.
 *
 * @param \stdClass $data Input data.
 * @param bool $nullwhenabsent Whether to return null if metadata form fields were not submitted.
 * @return array<int, array{key: string, value: string}>|null
 */
function smarturl_extract_metadata_entries(\stdClass $data, bool $nullwhenabsent = false): ?array {
    if (isset($data->metadata_entries) && is_array($data->metadata_entries)) {
        return $data->metadata_entries;
    }

    if (property_exists($data, 'metadata_json')) {
        $rawjson = trim((string)$data->metadata_json);
        if ($rawjson === '') {
            return [];
        }
        $decoded = json_decode($rawjson, true);
        if (is_array($decoded)) {
            $entries = [];
            foreach ($decoded as $row) {
                if (!is_array($row)) {
                    continue;
                }
                $key = trim((string)($row['key'] ?? ''));
                $val = trim((string)($row['value'] ?? ''));
                if ($key !== '' && $val !== '') {
                    $entries[] = ['key' => $key, 'value' => $val];
                }
            }
            return $entries;
        }
    }

    $foundany = false;
    $entries = [];
    for ($i = 0; $i < 40; $i++) {
        $kfield = "meta_key_{$i}";
        $cfield = "meta_customkey_{$i}";
        $vfield = "meta_val_{$i}";
        if (!property_exists($data, $kfield)) {
            continue;
        }
        $foundany = true;
        $key = trim((string)($data->$kfield ?? ''));
        if ($key === '__custom__') {
            $key = trim((string)($data->$cfield ?? ''));
        }
        $val = trim((string)($data->$vfield ?? ''));
        if ($key !== '' && $val !== '') {
            $entries[] = ['key' => $key, 'value' => $val];
        }
    }

    if (!$foundany && $nullwhenabsent) {
        return null;
    }
    return $entries;
}

/**
 * Collects custom completion rule settings from installed providers.
 *
 * @param \stdClass $data Form data.
 * @param mixed $mform Optional form instance.
 * @param string|null $fallback Existing JSON when called programmatically.
 * @return string|null JSON string or null.
 */
function smarturl_extract_custom_completion_json(\stdClass $data, $mform = null, ?string $fallback = null): ?string {
    if (isset($data->completion_custom_json)) {
        return $data->completion_custom_json ?: null;
    }
    $suffix = ($mform && method_exists($mform, 'get_suffix')) ? $mform->get_suffix() : '';
    $rules = [];
    foreach (rule_registry::providers() as $key => $provider) {
        $config = $provider->extract_config($data, $suffix);
        if ($config !== null) {
            $rules[$key] = $config;
        }
    }
    if (!empty($rules)) {
        return json_encode($rules, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    return $fallback;
}
