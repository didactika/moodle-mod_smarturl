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
 * Opens an embedded resource on demand after checking access to the activity.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');

use mod_smarturl\local\activity_content;
use mod_smarturl\local\presentation;
use mod_smarturl\local\viewer_data;
use mod_smarturl\local\url\resource_target;

$id = required_param('id', PARAM_INT);
$cm = get_coursemodule_from_id('smarturl', $id, 0, false, MUST_EXIST);
$course = get_course($cm->course);
require_course_login($course, true, $cm);
$context = context_module::instance($id);
require_capability('mod/smarturl:view', $context);

$instance = $DB->get_record('smarturl', ['id' => $cm->instance], '*', MUST_EXIST);
$profile = presentation::for_instance($instance);
if (!$profile['deferred']) {
    throw new moodle_exception('invalidurl', 'smarturl');
}

$target = viewer_data::target($instance, $course, $USER, $id, $profile);
$title = format_string(activity_content::title($instance), true, ['context' => $context]);
if ($target['kind'] !== 'media') {
    $destination = new moodle_url($target['embedurl'] ?? $target['url']);
    $host = $destination->get_host();
    if (!empty($target['playable']) && in_array($host, ['www.youtube-nocookie.com', 'www.youtube.com'], true)) {
        $destination->param('autoplay', 1);
    }
    redirect($destination);
}

$PAGE->set_url('/mod/smarturl/player.php', ['id' => $id]);
$PAGE->set_pagelayout('embedded');
$PAGE->set_show_navigation_footer(false);
$PAGE->activityheader->disable();
$PAGE->set_title($title);
echo $OUTPUT->header();
echo html_writer::div(viewer_data::render_target(resource_target::with_markup($target, $title), $title), 'mod-smarturl smu-player');
echo $OUTPUT->footer();
