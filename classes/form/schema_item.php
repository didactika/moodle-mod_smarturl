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

use context;
use context_system;
use core_form\dynamic_form;
use mod_smarturl\local\metadata\category_manager;
use mod_smarturl\local\metadata\metadata_type_manager;
use mod_smarturl\local\metadata\param_def_manager;
use mod_smarturl\local\metadata\schema_catalogue;
use moodle_url;

/**
 * Creates, edits and removes site-wide Smart URL schema items in a Moodle modal.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class schema_item extends dynamic_form {
    /**
     * Returns the catalogue section.
     *
     * @return string
     */
    private function section(): string {
        $section = $this->optional_param('section', '', PARAM_ALPHA);
        if (!in_array($section, schema_catalogue::SECTIONS, true)) {
            throw new \invalid_parameter_exception('Invalid schema section.');
        }
        return $section;
    }

    /**
     * Loads the current item.
     *
     * @return \stdClass|null
     */
    private function record(): ?\stdClass {
        $id = $this->optional_param('id', 0, PARAM_INT);
        return $id ? schema_catalogue::record($this->section(), $id) : null;
    }

    /**
     * Returns the system context.
     *
     * @return context
     */
    protected function get_context_for_dynamic_submission(): context {
        return context_system::instance();
    }

    /**
     * Requires the capability used by the site administration.
     */
    protected function check_access_for_dynamic_submission(): void {
        require_capability('mod/smarturl:manageschema', $this->get_context_for_dynamic_submission());
    }

    /**
     * Returns the catalogue URL.
     *
     * @return moodle_url
     */
    protected function get_page_url_for_dynamic_submission(): moodle_url {
        return new moodle_url('/mod/smarturl/admin.php', ['tab' => $this->section()]);
    }

    /**
     * Defines the editor or the confirmation form.
     */
    public function definition(): void {
        global $OUTPUT;
        $form = $this->_form;
        $section = $this->section();
        $record = $this->record();
        $remove = $this->optional_param('remove', false, PARAM_BOOL);
        foreach (['section' => PARAM_ALPHA, 'id' => PARAM_INT, 'remove' => PARAM_BOOL] as $name => $type) {
            $form->addElement('hidden', $name);
            $form->setType($name, $type);
        }
        $form->addElement('html', \html_writer::empty_tag('span', ['data-smarturl-schema-form' => '1']));
        if ($record && $remove) {
            if ($section === 'categories') {
                $choices = [0 => get_string('archivecategoryfields', 'smarturl')];
                foreach (category_manager::all() as $category) {
                    if ((int)$category->id !== (int)$record->id) {
                        $choices[$category->id] = format_string($category->name);
                    }
                }
                $form->addElement('html', $OUTPUT->notification(
                    get_string('deletecategoryinfo', 'smarturl', $record->fields),
                    'warning',
                ));
                $form->addElement('select', 'destination', get_string('movecategoryfields', 'smarturl'), $choices);
            } else {
                $form->addElement('html', \html_writer::tag('p', get_string('delete_' . $section, 'smarturl')));
            }
            return;
        }

        $form->addElement('text', 'name', get_string('name'), ['maxlength' => $section === 'categories' ? 64 : 100]);
        $form->setType('name', PARAM_TEXT);
        $form->addRule('name', null, 'required', null, 'client');
        if ($section !== 'categories') {
            $form->addElement('text', 'shortname', get_string('shortname', 'smarturl'), ['maxlength' => 64]);
            $form->setType('shortname', PARAM_ALPHANUMEXT);
            $form->addRule('shortname', null, 'required', null, 'client');
            $form->addElement('textarea', 'description', get_string('description'), ['rows' => 2]);
            $form->setType('description', PARAM_TEXT);
        }
        if ($section === 'fields') {
            $choices = [0 => get_string('defaultcategory', 'smarturl')];
            foreach (category_manager::all() as $category) {
                $choices[$category->id] = format_string($category->name);
            }
            $form->addElement('select', 'categoryid', get_string('category', 'smarturl'), $choices);
            $form->addElement('select', 'datatype', get_string('datatype', 'smarturl'), schema_catalogue::datatypes());
            $form->addElement('select', 'display_priority', get_string('priority', 'smarturl'), schema_catalogue::priorities());
            foreach (['searchable', 'filterable'] as $name) {
                $form->addElement('advcheckbox', $name, get_string($name, 'smarturl'));
            }
        } else if ($section === 'variables') {
            $form->addElement('select', 'source_type', get_string('sourcetype', 'smarturl'), schema_catalogue::sources());
            foreach (param_def_manager::source_options() as $type => $values) {
                $name = 'source_' . strtolower($type);
                $options = ['' => get_string('choosedots')] + $values;
                if ($record && $record->source_type === $type && !isset($options[$record->source_key])) {
                    $options[$record->source_key] = $record->source_key;
                }
                $form->addElement('select', $name, get_string('sourcekey', 'smarturl'), $options);
                $form->hideIf($name, 'source_type', 'neq', $type);
            }
            $form->addElement('text', 'source_static', get_string('constantvalue', 'smarturl'));
            $form->setType('source_static', PARAM_RAW_TRIMMED);
            $form->hideIf('source_static', 'source_type', 'neq', 'STATIC');
            $form->addElement('text', 'default_query_param', get_string('defaultqueryparam', 'smarturl'));
            $form->setType('default_query_param', PARAM_ALPHANUMEXT);
        }
        $form->addElement('text', 'sortorder', get_string('categorysort', 'smarturl'), ['size' => 6]);
        $form->setType('sortorder', PARAM_INT);
        $form->addElement('advcheckbox', 'enabled', get_string('enabled', 'smarturl'));
    }

    /**
     * Sets the existing values and defaults.
     */
    public function set_data_for_dynamic_submission(): void {
        $data = (array)$this->record() + [
            'id' => 0, 'enabled' => 1, 'searchable' => 1, 'filterable' => 1, 'sortorder' => 0,
            'datatype' => 'TEXT', 'display_priority' => 'SECONDARY', 'source_type' => 'BUILTIN',
        ];
        $data['section'] = $this->section();
        $data['remove'] = $this->optional_param('remove', false, PARAM_BOOL);
        $data['source_' . strtolower($data['source_type'])] = $data['source_key'] ?? '';
        $this->set_data($data);
    }

    /**
     * Checks form values in addition to the Moodle validation.
     *
     * @param array $data Submission.
     * @param array $files Draft data.
     * @return array
     */
    public function validation($data, $files): array {
        global $DB;
        $errors = parent::validation($data, $files);
        if (!empty($data['remove'])) {
            return $errors;
        }
        $section = $this->section();
        $key = $section === 'categories' ? 'name' : 'shortname';
        $value = trim($data[$key]);
        if ($section !== 'categories') {
            $value = strtolower($value);
        }
        $existing = $DB->get_record(schema_catalogue::TABLES[$section], [$key => $value], 'id');
        if ($value === '') {
            $errors[$key] = get_string('required');
        } else if ($existing && (int)$existing->id !== (int)$data['id']) {
            $errors[$key] = get_string('duplicateschemaitem', 'smarturl');
        }
        if (trim($data['name']) === '') {
            $errors['name'] = get_string('required');
        }
        if ($section === 'variables') {
            $source = 'source_' . strtolower($data['source_type']);
            if (!isset($data[$source]) || trim((string)$data[$source]) === '') {
                $errors[$source] = get_string('required');
            }
        }
        return $errors;
    }

    /**
     * Saves the item or applies a confirmed deletion.
     *
     * @return array
     */
    public function process_dynamic_submission(): array {
        $data = (array)$this->get_data();
        $section = $this->section();
        $id = (int)$data['id'];
        if (!empty($data['remove']) && $id) {
            match ($section) {
                'categories' => category_manager::delete($id, (int)($data['destination'] ?? 0)),
                'fields' => metadata_type_manager::delete($id),
                'variables' => param_def_manager::delete($id),
            };
            return schema_catalogue::rows();
        }
        if ($section === 'categories') {
            category_manager::save($id, $data['name'], (bool)$data['enabled'], (int)$data['sortorder'] ?: null);
        } else if ($section === 'fields') {
            $previous = $this->record();
            $data['icon'] = $previous->icon ?? null;
            metadata_type_manager::save($data);
        } else {
            $data['source_key'] = $data['source_' . strtolower($data['source_type'])];
            param_def_manager::save($data);
        }
        return schema_catalogue::rows();
    }
}
