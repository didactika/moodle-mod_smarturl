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
 * Admin schema page for configuring Metadata Types and Dynamic URL Parameters.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');
require_once($CFG->libdir . '/adminlib.php');

admin_externalpage_setup('modsmarturlschema');
require_capability('mod/smarturl:manageschema', context_system::instance());

$tab = optional_param('tab', 'fields', PARAM_ALPHA);
$PAGE->set_title(get_string('adminconfigtitle', 'smarturl'));
$PAGE->set_heading(get_string('adminconfigtitle', 'smarturl'));

echo $OUTPUT->header();
$catalogue = $PAGE->get_renderer('mod_smarturl')->render(new \mod_smarturl\output\admin_config_page($tab));
echo html_writer::div($catalogue, 'mod-smarturl');
echo $OUTPUT->footer();
