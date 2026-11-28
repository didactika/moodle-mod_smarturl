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
 * Lists all Smart URL activities in a course.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');

$id = required_param('id', PARAM_INT);
$course = $DB->get_record('course', ['id' => $id], '*', MUST_EXIST);

require_course_login($course, true);
$context = context_course::instance($course->id);

\mod_smarturl\event\course_module_instance_list_viewed::create(['context' => $context])->trigger();

$PAGE->set_url('/mod/smarturl/index.php', ['id' => $course->id]);
$PAGE->set_title($course->shortname . ': ' . get_string('modulenameplural', 'smarturl'));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_pagelayout('incourse');

echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('modulenameplural', 'smarturl'));

$smarturls = get_all_instances_in_course('smarturl', $course);
if (empty($smarturls)) {
    notice(get_string('nosmarturls', 'smarturl'), new moodle_url('/course/view.php', ['id' => $course->id]));
}

$table = new html_table();
$table->attributes['class'] = 'table generaltable table-hover mb-0';
$table->caption = get_string('modulenameplural', 'smarturl');
$table->captionhide = true;
$table->head = [
    get_string('sectionname', 'format_' . $course->format),
    get_string('name'),
    get_string('displaymode', 'smarturl'),
];
foreach ($smarturls as $item) {
    $link = html_writer::link(
        new moodle_url('/mod/smarturl/view.php', ['id' => $item->coursemodule]),
        format_string(\mod_smarturl\local\activity_content::title($item))
    );
    $profile = \mod_smarturl\local\presentation::for_instance($item);
    $table->data[] = [get_section_name($course, $item->section), $link,
        get_string('launch_' . strtolower($profile['launch']), 'smarturl')];
}
echo html_writer::div(html_writer::table($table), 'table-responsive card', ['data-region' => 'tablewrap']);
echo $OUTPUT->footer();
