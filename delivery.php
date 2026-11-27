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
 * Serves a remote file after checking access to the activity.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');

use mod_smarturl\local\presentation;
use mod_smarturl\local\remote_delivery;
use mod_smarturl\local\url\url_resolver;

$id = required_param('id', PARAM_INT);
$cm = get_coursemodule_from_id('smarturl', $id, 0, false, MUST_EXIST);
$course = get_course($cm->course);
require_course_login($course, true, $cm);
require_capability('mod/smarturl:view', context_module::instance($id));
$activity = $DB->get_record('smarturl', ['id' => $cm->instance], '*', MUST_EXIST);
if (!presentation::for_instance($activity)['gateway']) {
    throw new moodle_exception('deliveryinvalid', 'smarturl');
}
$url = url_resolver::resolve($activity, $course, $USER, $id);
\core\session\manager::write_close();
remote_delivery::send($url);
