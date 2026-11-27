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
 * Displays a Smart URL activity with Didactika UI and high-volume metadata explorer.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');
require_once(__DIR__ . '/lib.php');

use mod_smarturl\local\activity_content;
use mod_smarturl\local\presentation;
use mod_smarturl\local\viewer_data;

$id = optional_param('id', 0, PARAM_INT);
$s = optional_param('s', 0, PARAM_INT);

if ($s) {
    $smarturl = $DB->get_record('smarturl', ['id' => $s], '*', MUST_EXIST);
    $cm = get_coursemodule_from_instance('smarturl', $smarturl->id, $smarturl->course, false, MUST_EXIST);
} else {
    $cm = get_coursemodule_from_id('smarturl', $id, 0, false, MUST_EXIST);
    $smarturl = $DB->get_record('smarturl', ['id' => $cm->instance], '*', MUST_EXIST);
}

$course = $DB->get_record('course', ['id' => $cm->course], '*', MUST_EXIST);

require_course_login($course, true, $cm);
$context = context_module::instance($cm->id);
require_capability('mod/smarturl:view', $context);

$auxiliary = optional_param('aux', false, PARAM_BOOL);
$forceview = optional_param('forceview', false, PARAM_BOOL);
$profile = presentation::for_instance($smarturl);
$target = viewer_data::target($smarturl, $course, $USER, (int)$cm->id, $profile);
if (
    !$auxiliary && !$forceview && ($profile['launch'] === 'EXTERNAL'
        || ($profile['launch'] === 'AUTO' && $target['kind'] === 'link'))
) {
    redirect(new moodle_url('/mod/smarturl/go.php', ['id' => $cm->id]));
}
smarturl_view($smarturl, $course, $cm, $context);

$PAGE->set_url('/mod/smarturl/view.php', ['id' => $cm->id] + ($auxiliary ? ['aux' => 1] : []));
if ($auxiliary) {
    $PAGE->set_pagelayout('embedded');
    $PAGE->activityheader->disable();
}
$name = format_string(activity_content::title($smarturl), true, ['context' => $context]);
$PAGE->activityheader->set_description('');
$PAGE->set_title($name);
$PAGE->set_heading($auxiliary ? $name : format_string($course->fullname));

$page = new \mod_smarturl\output\resource_page($smarturl, $course, $cm, $context, $USER);
$body = $PAGE->get_renderer('mod_smarturl')->render($page);

echo $OUTPUT->header();
if ($auxiliary) {
    echo html_writer::div($OUTPUT->heading($name, 1, 'h3'), 'container py-3 pb-0');
}
echo html_writer::div($body, 'mod-smarturl' . ($auxiliary ? ' smu-auxiliary-viewer container pb-4' : ''));
echo $OUTPUT->footer();
