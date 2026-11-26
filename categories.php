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
 * Site-wide metadata categories.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');
require_once($CFG->libdir . '/adminlib.php');

use mod_smarturl\local\metadata\category_manager;

admin_externalpage_setup('modsmarturlschema');
require_capability('mod/smarturl:manageschema', context_system::instance());
$url = new moodle_url('/mod/smarturl/categories.php');
$PAGE->set_url($url);
$PAGE->set_title(get_string('categories', 'smarturl'));

$all = category_manager::all();
$id = optional_param('id', 0, PARAM_INT);
$editing = $all[$id] ?? null;
$action = optional_param('action', '', PARAM_ALPHA);
$form = new \mod_smarturl\form\category($url, ['category' => $editing]);
if ($form->is_cancelled()) {
    redirect($url);
}
if ($data = $form->get_data()) {
    category_manager::save($data->id, $data->name, (bool)$data->enabled, (int)$data->sortorder);
    redirect($url, get_string('changessaved'));
}
if ($action === 'delete' && $editing && data_submitted()) {
    require_sesskey();
    category_manager::delete($id, optional_param('destination', 0, PARAM_INT));
    redirect($url, get_string('category_deleted', 'smarturl'));
}

echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('categories', 'smarturl'));
echo html_writer::link(new moodle_url('/mod/smarturl/admin.php'), get_string('adminconfiglink', 'smarturl'));

if ($action === 'delete' && $editing) {
    echo html_writer::start_tag('form', ['method' => 'post', 'action' => $url->out(false), 'class' => 'card card-body my-3']);
    echo $OUTPUT->heading(get_string('deletecategoryheading', 'smarturl', format_string($editing->name)), 2, 'h5');
    echo html_writer::tag('p', get_string('deletecategoryinfo', 'smarturl', $editing->fields));
    foreach (['id' => $id, 'action' => 'delete', 'sesskey' => sesskey()] as $key => $value) {
        echo html_writer::empty_tag('input', ['type' => 'hidden', 'name' => $key, 'value' => $value]);
    }
    $destinations = [0 => get_string('archivecategoryfields', 'smarturl')];
    foreach ($all as $category) {
        if ((int)$category->id !== $id) {
            $destinations[$category->id] = format_string($category->name);
        }
    }
    echo html_writer::tag('label', get_string('movecategoryfields', 'smarturl'), ['for' => 'menudestination']);
    echo html_writer::select($destinations, 'destination', 0, false, ['class' => 'custom-select mb-3']);
    echo html_writer::div(
        html_writer::tag('button', get_string('delete'), ['type' => 'submit', 'class' => 'btn btn-danger mr-2 me-2'])
        . html_writer::link($url, get_string('cancel'), ['class' => 'btn btn-secondary']),
        'd-flex flex-wrap'
    );
    echo html_writer::end_tag('form');
} else if ($action === 'edit' || $action === 'add') {
    echo html_writer::start_div('card card-body my-3');
    $form->display();
    echo html_writer::end_div();
}

echo html_writer::start_div('card my-3 mod-smarturl');
echo html_writer::div(
    html_writer::link(
        new moodle_url($url, ['action' => 'add']),
        get_string('createcategory', 'smarturl'),
        ['class' => 'btn btn-primary']
    ),
    'card-header d-flex justify-content-end'
);
if (!$all) {
    echo html_writer::div(get_string('emptycategories', 'smarturl'), 'card-body');
} else {
    $table = new html_table();
    $table->caption = get_string('categories', 'smarturl');
    $table->captionhide = true;
    $table->attributes['class'] = 'table table-hover mb-0';
    $table->head = [get_string('category', 'smarturl'), get_string('metadatatypes', 'smarturl'),
        get_string('status'), get_string('actions')];
    foreach ($all as $record) {
        $edit = new moodle_url($url, ['action' => 'edit', 'id' => $record->id]);
        $delete = new moodle_url($url, ['action' => 'delete', 'id' => $record->id]);
        $name = format_string($record->name);
        $title = new html_table_cell(html_writer::link($edit, $name));
        $title->header = true;
        $title->scope = 'row';
        $buttons = html_writer::link(
            $edit,
            $OUTPUT->pix_icon('t/edit', ''),
            ['class' => 'btn btn-icon', 'aria-label' => get_string('edit') . ' ' . $name]
        );
        $buttons .= html_writer::link(
            $delete,
            $OUTPUT->pix_icon('t/delete', ''),
            ['class' => 'btn btn-icon text-danger', 'aria-label' => get_string('delete') . ' ' . $name]
        );
        $table->data[] = [$title, $record->fields, get_string($record->enabled ? 'enabled' : 'disabled', 'smarturl'), $buttons];
    }
    echo html_writer::div(html_writer::table($table), 'table-responsive', ['data-region' => 'tablewrap']);
}
echo html_writer::end_div();
echo $OUTPUT->footer();
