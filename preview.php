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
 * Renders a draft resource for teachers without recording learning activity.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');
require_once(__DIR__ . '/lib.php');

use mod_smarturl\local\activity_content;
use mod_smarturl\local\presentation;
use mod_smarturl\local\url\resource_target;
use mod_smarturl\local\url\url_resolver;
use mod_smarturl\local\viewer_data;

$courseid = required_param('courseid', PARAM_INT);
$cmid = optional_param('cmid', 0, PARAM_INT);
$surface = optional_param('surface', 'course', PARAM_ALPHA);
$lang = optional_param('language', current_language(), PARAM_LANG);
$course = get_course($courseid);
$cm = $cmid ? get_coursemodule_from_id('smarturl', $cmid, $courseid, false, MUST_EXIST) : null;
require_login($course, false, $cm);
require_sesskey();
$context = $cm ? context_module::instance($cmid) : context_course::instance($courseid);
require_capability('moodle/course:manageactivities', $context);
if (!$cm) {
    require_capability('mod/smarturl:addinstance', $context);
}
if ($lang && array_key_exists($lang, get_string_manager()->get_list_of_translations())) {
    force_current_language($lang);
}
$PAGE->set_context($context);
$PAGE->set_url('/mod/smarturl/preview.php', ['courseid' => $courseid, 'cmid' => $cmid]);
$PAGE->set_pagelayout('popup');
$PAGE->set_title(get_string('previewresource', 'smarturl'));

$data = (object)json_decode(required_param('draft', PARAM_RAW), true, 32, JSON_THROW_ON_ERROR);
$data->display_mode = 'AUTO';
$data->name = trim((string)($data->name ?? '')) ?: get_string('previewresource', 'smarturl');
$data->intro = $data->{'introeditor[text]'} ?? '';
$data->introformat = (int)($data->{'introeditor[format]'} ?? FORMAT_HTML);
foreach (get_object_vars($data) as $field => $value) {
    if (preg_match('/^(smu_i18n_[a-z0-9_]+_description)\[(text|format)\]$/D', $field, $parts)) {
        $data->{$parts[1]}[$parts[2]] = $value;
    }
}
$data->presentation_json = presentation::from_submission($data);
$data->translations_json = activity_content::from_submission($data);
$profile = presentation::for_instance($data);
$name = format_string(activity_content::title($data), true, ['context' => $context]);
$target = null;
$message = '';
try {
    $resolved = url_resolver::preview_sample(
        (string)($data->externalurl ?? ''),
        url_resolver::decode_bindings($data->parameters_json ?? null)
    );
    $target = resource_target::with_markup(resource_target::describe($resolved, $profile['viewer'] === 'EMBED'), $name);
} catch (invalid_parameter_exception $error) {
    $message = get_string('invalidurl', 'smarturl');
}

$poster = null;
if ($profile['poster'] === 'AUTO' || $profile['poster'] === 'UPLOAD') {
    $draft = (int)($data->poster_filemanager ?? 0);
    if (
        $draft && ($files = get_file_storage()->get_area_files(
            context_user::instance($USER->id)->id,
            'user',
            'draft',
            $draft,
            'id DESC',
            false
        ))
    ) {
        $file = reset($files);
        $poster = moodle_url::make_draftfile_url($draft, $file->get_filepath(), $file->get_filename())->out(false);
    }
}
if (!$poster && !empty($data->thumbnail_url) && in_array($profile['poster'], ['AUTO', 'URL'], true)) {
    try {
        $poster = resource_target::normalise($data->thumbnail_url);
    } catch (invalid_parameter_exception) {
        $poster = null;
    }
}
if (!$poster && in_array($profile['poster'], ['AUTO', 'PROVIDER'], true)) {
    $poster = $target['poster'] ?? null;
}

$metadata = [];
$definitions = array_column(\mod_smarturl\local\metadata\metadata_type_manager::list_all(true), null, 'shortname');
foreach (smarturl_extract_metadata_entries($data) as $entry) {
    $definition = $definitions[$entry['key']] ?? null;
    if ($definition && $definition->display_priority === 'HIDDEN') {
        continue;
    }
    $metadata[] = $entry + ['label' => $definition->name ?? $entry['key'],
        'priority' => $definition->display_priority ?? 'SECONDARY', 'group' => $definition->group_name ?? ''];
}
$incourse = $surface === 'course';
$imageonly = $incourse && $profile['course'] === 'IMAGE' && $poster;
$metadata = $imageonly ? [] : presentation::select_fields(
    $metadata,
    $incourse ? $profile['coursefields'] : $profile['viewerfields'],
    $incourse
);
$description = (!$incourse || (!$imageonly && $profile['description']))
    ? activity_content::description($data, $context, 0) : '';

echo $OUTPUT->header();
echo html_writer::start_div('mod-smarturl smu-draft-preview');
if (!$imageonly && (!$incourse || $profile['title'])) {
    echo $OUTPUT->heading($name);
}
if ($message) {
    echo $OUTPUT->notification($message, 'info');
}
$embed = $target && !$incourse && in_array($profile['viewer'], ['AUTO', 'EMBED'], true) && $target['kind'] !== 'link';
$useposter = $poster && ($incourse ? $profile['course'] !== 'LINK' : $profile['viewer'] === 'POSTER');
if ($embed) {
    echo html_writer::div(viewer_data::render_target($target, $name), 'smu-player');
} else if ($useposter) {
    $image = html_writer::empty_tag('img', ['src' => $poster, 'alt' => $name, 'class' => 'smu-viewer-cover']);
    if (
        $incourse && $profile['play'] && (!empty($target['playable']) || in_array(
            $target['kind'] ?? '',
            ['audio', 'video', 'media'],
            true,
        ))
    ) {
        $image .= html_writer::span(get_string('playresource', 'smarturl'), 'btn btn-primary smu-play-overlay');
    }
    echo html_writer::div($image, 'position-relative mb-3');
}
if ($target) {
    $buttonlabel = $incourse ? get_string('launch_' . strtolower($profile['launch']), 'smarturl')
        : get_string('openexternal', 'smarturl');
    if (!$imageonly) {
        echo html_writer::tag('button', $buttonlabel, ['class' => 'btn btn-outline-secondary', 'disabled' => true]);
    }
}
if (trim($description) !== '') {
    echo html_writer::div($OUTPUT->heading(get_string('description'), 2, 'h5') . $description, 'card card-body mt-3');
}
if ($metadata) {
    echo $OUTPUT->heading(get_string('metadataheading', 'smarturl'), 2, 'h5 mt-3');
    echo html_writer::start_tag('dl', ['class' => 'row']);
    foreach ($metadata as $entry) {
        echo html_writer::tag('dt', s($entry['label']), ['class' => 'col-sm-4']);
        echo html_writer::tag('dd', s($entry['value']), ['class' => 'col-sm-8']);
    }
    echo html_writer::end_tag('dl');
}
echo html_writer::end_div();
echo $OUTPUT->footer();
