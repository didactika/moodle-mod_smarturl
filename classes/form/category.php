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

namespace mod_smarturl\form;

defined('MOODLE_INTERNAL') || die();
require_once($CFG->libdir . '/formslib.php');

/**
 * Edits a site-wide Smart URL category with Moodle form controls.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class category extends \moodleform {
    /**
     * Defines the category fields.
     */
    public function definition(): void {
        $form = $this->_form;
        $record = $this->_customdata['category'];
        $form->addElement('hidden', 'id', $record->id ?? 0);
        $form->setType('id', PARAM_INT);
        $form->addElement('hidden', 'action', $record ? 'edit' : 'add');
        $form->setType('action', PARAM_ALPHA);
        $form->addElement('text', 'name', get_string('category_name', 'smarturl'));
        $form->setType('name', PARAM_TEXT);
        $form->addRule('name', null, 'required');
        $form->addRule('name', get_string('maximumchars', 'moodle', 64), 'maxlength', 64);
        $form->addElement('text', 'sortorder', get_string('categorysort', 'smarturl'));
        $form->setType('sortorder', PARAM_INT);
        $form->addElement('advcheckbox', 'enabled', get_string('enabled', 'smarturl'));
        $form->setDefault('name', $record->name ?? '');
        $form->setDefault('sortorder', $record->sortorder ?? 10);
        $form->setDefault('enabled', $record->enabled ?? 1);
        $this->add_action_buttons(true, get_string('savecategory', 'smarturl'));
    }

    /**
     * Validates the display name.
     *
     * @param array $data Submitted data.
     * @param array $files Submitted files.
     * @return array
     */
    public function validation($data, $files): array {
        global $DB;
        $errors = parent::validation($data, $files);
        $name = trim($data['name']);
        $existing = $DB->get_record('smarturl_meta_category', ['name' => $name], 'id');
        if ($existing && (int)$existing->id !== (int)$data['id']) {
            $errors['name'] = get_string('duplicatecategory', 'smarturl');
        }
        return $errors;
    }
}
