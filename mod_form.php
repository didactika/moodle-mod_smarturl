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

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/course/moodleform_mod.php');
require_once($CFG->dirroot . '/mod/url/locallib.php');

use mod_smarturl\completion\rule_registry;
use mod_smarturl\local\metadata\metadata_repository;
use mod_smarturl\local\metadata\metadata_type_manager;
use mod_smarturl\local\metadata\param_def_manager;
use mod_smarturl\local\permissions\admin_permissions;
use mod_smarturl\local\policy\availability_composer;
use mod_smarturl\local\policy\policy_manager;
use mod_smarturl\local\url\url_resolver;

/**
 * Activity settings form for mod_smarturl with native availability, completion, dynamic params, metadata and policy locks.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_smarturl_mod_form extends moodleform_mod {
    /** @var \stdClass|null */
    private ?\stdClass $policy = null;

    /**
     * Defines all standard and Smart URL fields.
     */
    public function definition(): void {
        $mform = $this->_form;

        if (!empty($this->_cm->id)) {
            $this->policy = policy_manager::get_by_cmid((int)$this->_cm->id);
        }

        if ($this->policy && !empty($this->policy->managed_by)) {
            $locked = policy_manager::locked_fields($this->policy);
            if (!empty($locked)) {
                $notice = get_string('policylocknotice', 'smarturl', (object)[
                    'managedby' => s($this->policy->managed_by),
                    'fields' => implode(', ', $locked),
                ]);
                $mform->addElement('html', html_writer::div($notice, 'alert alert-info'));
            }
        }

        // General.
        $mform->addElement('header', 'general', get_string('general', 'form'));
        $mform->addElement('text', 'name', get_string('smarturlname', 'smarturl'), ['size' => '64']);
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');
        $mform->addRule('name', get_string('maximumchars', '', 255), 'maxlength', 255, 'client');

        $mform->addElement('text', 'externalurl', get_string('externalurl', 'smarturl'), ['size' => '80']);
        $mform->setType('externalurl', PARAM_RAW_TRIMMED);
        $mform->addHelpButton('externalurl', 'externalurl', 'smarturl');
        $mform->addRule('externalurl', null, 'required', null, 'client');

        $this->standard_intro_elements();

        $mform->addElement('text', 'thumbnail_url', get_string('thumbnailurl', 'smarturl'), ['size' => '80']);
        $mform->setType('thumbnail_url', PARAM_URL);
        $mform->addElement('filemanager', 'poster_filemanager', get_string('thumbnailurl', 'smarturl'), null, [
            'subdirs' => 0,
            'maxfiles' => 1,
            'accepted_types' => ['image'],
        ]);

        // Appearance.
        $mform->addElement('header', 'appearancehdr', get_string('appearance', 'smarturl'));
        $displayoptions = [
            'AUTO' => get_string('display_auto', 'smarturl'),
            'INLINE_IFRAME' => get_string('display_inline_iframe', 'smarturl'),
            'MODAL' => get_string('display_modal', 'smarturl'),
            'POPUP' => get_string('display_popup', 'smarturl'),
            'EMBED' => get_string('display_embed', 'smarturl'),
            'NEW' => get_string('display_new', 'smarturl'),
            'OPEN' => get_string('display_open', 'smarturl'),
            'CARD' => get_string('display_card', 'smarturl'),
        ];
        $mform->addElement('select', 'display_mode', get_string('displaymode', 'smarturl'), $displayoptions);
        $mform->setDefault('display_mode', get_config('mod_smarturl', 'defaultdisplay') ?: 'AUTO');

        $mform->addElement('text', 'popup_width', get_string('popupwidth', 'smarturl'), ['size' => '6']);
        $mform->setType('popup_width', PARAM_INT);
        $mform->setDefault('popup_width', (int)get_config('mod_smarturl', 'defaultpopupwidth') ?: 1200);
        $mform->hideIf('popup_width', 'display_mode', 'neq', 'POPUP');

        $mform->addElement('text', 'popup_height', get_string('popupheight', 'smarturl'), ['size' => '6']);
        $mform->setType('popup_height', PARAM_INT);
        $mform->setDefault('popup_height', (int)get_config('mod_smarturl', 'defaultpopupheight') ?: 800);
        $mform->hideIf('popup_height', 'display_mode', 'neq', 'POPUP');

        $mform->addElement('select', 'aspect_ratio', get_string('aspectratio', 'smarturl'), [
            '16:9' => '16:9',
            '4:3' => '4:3',
            '1:1' => '1:1',
            '21:9' => '21:9',
        ]);
        $mform->setDefault('aspect_ratio', '16:9');

        $mform->addElement('text', 'duration_seconds', get_string('durationseconds', 'smarturl'), ['size' => '8']);
        $mform->setType('duration_seconds', PARAM_INT);

        // Dynamic URL Parameters.
        $mform->addElement('header', 'dynamicparamshdr', get_string('dynamicparams', 'smarturl'));
        $mform->addElement('static', 'dynamicparamsinfo', '', get_string('dynamicparams_help', 'smarturl'));

        $paramdefs = param_def_manager::list_all(true);
        $varoptions = ['' => get_string('param_choose', 'smarturl')];
        foreach ($paramdefs as $def) {
            $varoptions[$def->shortname] = "{$def->name} ({$def->shortname})";
        }
        $varoptions['__static__'] = get_string('param_staticvalue', 'smarturl');

        $existingparams = !empty($this->current->parameters_json)
            ? url_resolver::decode_bindings((string)$this->current->parameters_json)
            : [];
        $paramrepeats = max(3, count($existingparams) + 2);
        $this->repeat_elements([
            $mform->createElement('text', 'param_name', get_string('param_queryname', 'smarturl'), ['size' => '20', 'placeholder' => 'query_param']),
            $mform->createElement('select', 'param_var', get_string('param_source', 'smarturl'), $varoptions),
            $mform->createElement('text', 'param_static', get_string('param_staticvalue', 'smarturl'), ['size' => '20', 'placeholder' => 'literal value']),
        ], $paramrepeats, [
            'param_name' => ['type' => PARAM_ALPHANUMEXT],
            'param_static' => ['type' => PARAM_RAW],
        ], 'param_repeats', 'param_add', 2, get_string('param_addmore', 'smarturl'), true);

        // Structured Metadata.
        $mform->addElement('header', 'metadatahdr', get_string('metadatasection', 'smarturl'));
        $mform->addElement('static', 'metadatainfo', '', get_string('metadatasection_help', 'smarturl'));

        $metatypes = metadata_type_manager::list_all(true);
        $metakeyoptions = ['' => get_string('choose', 'moodle')];
        foreach ($metatypes as $mt) {
            $metakeyoptions[$mt->shortname] = "[{$mt->group_name}] {$mt->name}";
        }
        $metakeyoptions['__custom__'] = get_string('meta_customkey', 'smarturl');

        $existingmeta = !empty($this->current->id) ? metadata_repository::for_instance((int)$this->current->id, true) : [];
        $metarepeats = max(4, count($existingmeta) + 2);
        $this->repeat_elements([
            $mform->createElement('select', 'meta_key', get_string('meta_key', 'smarturl'), $metakeyoptions),
            $mform->createElement('text', 'meta_customkey', get_string('meta_customkey', 'smarturl'), ['size' => '20', 'placeholder' => 'custom_key']),
            $mform->createElement('text', 'meta_val', get_string('meta_value', 'smarturl'), ['size' => '45', 'placeholder' => 'Value']),
        ], $metarepeats, [
            'meta_customkey' => ['type' => PARAM_ALPHANUMEXT],
            'meta_val' => ['type' => PARAM_RAW],
        ], 'meta_repeats', 'meta_add', 2, get_string('meta_addmore', 'smarturl'), true);

        $this->standard_coursemodule_elements();
        $this->add_action_buttons();
    }

    /**
     * Adds extensible custom completion rules from subplugins and hooks.
     *
     * @return array Element names added to the completion section.
     */
    public function add_completion_rules(): array {
        $mform = $this->_form;
        $suffix = $this->get_suffix();
        $context = $this->context ?? \context_course::instance((int)$this->current->course);
        $locked = !policy_manager::can_edit_field('completion', $this->policy, $context, $this->userid());

        $elements = [];
        foreach (rule_registry::providers() as $provider) {
            $added = $provider->extend_form($mform, $suffix, $context, $locked);
            $elements = array_merge($elements, $added);
        }
        return $elements;
    }

    /**
     * Checks whether any custom completion rule is enabled in form data.
     *
     * @param array $data Form data.
     * @return bool
     */
    public function completion_rule_enabled($data): bool {
        $suffix = $this->get_suffix();
        $obj = (object)$data;
        foreach (rule_registry::providers() as $provider) {
            if ($provider->extract_config($obj, $suffix) !== null) {
                return true;
            }
        }
        return false;
    }

    /**
     * Preprocesses existing parameter bindings, metadata rows, poster files, and custom availability.
     *
     * @param array $defaultvalues Default form values.
     */
    public function data_preprocessing(&$defaultvalues): void {
        parent::data_preprocessing($defaultvalues);

        if (!empty($defaultvalues['parameters_json'])) {
            $bindings = url_resolver::decode_bindings((string)$defaultvalues['parameters_json']);
            foreach ($bindings as $idx => $binding) {
                $defaultvalues["param_name[{$idx}]"] = $binding['param'];
                $defaultvalues["param_var[{$idx}]"] = $binding['mode'] === 'static' ? '__static__' : $binding['var'];
                $defaultvalues["param_static[{$idx}]"] = $binding['value'];
            }
        }

        if (!empty($defaultvalues['id'])) {
            $draftitemid = file_get_submitted_draft_itemid('poster_filemanager');
            file_prepare_draft_area($draftitemid, $this->context->id, 'mod_smarturl', 'poster', 0, ['subdirs' => 0, 'maxfiles' => 1]);
            $defaultvalues['poster_filemanager'] = $draftitemid;

            $entries = metadata_repository::for_instance((int)$defaultvalues['id'], true);
            $defined = metadata_type_manager::list_all(true);
            $known = array_flip(array_map(static fn($mt) => $mt->shortname, $defined));
            foreach ($entries as $idx => $entry) {
                if (isset($known[$entry['key']])) {
                    $defaultvalues["meta_key[{$idx}]"] = $entry['key'];
                } else {
                    $defaultvalues["meta_key[{$idx}]"] = '__custom__';
                    $defaultvalues["meta_customkey[{$idx}]"] = $entry['key'];
                }
                $defaultvalues["meta_val[{$idx}]"] = $entry['value'];
            }
        }

        // Preserve external managed availability transparently when editing local restrictions.
        if (!empty($this->_cm->id)) {
            $policy = policy_manager::get_by_cmid((int)$this->_cm->id);
            if ($policy && !empty($policy->managed_availability_json) && !admin_permissions::allows('mod/smarturl:overrideavailability', $this->context)) {
                $defaultvalues['availabilityconditionsjson'] = $policy->custom_availability_json ?? '';
            }
        }
    }

    /**
     * Enforces granular capabilities and external policy field locks after data loading.
     */
    public function definition_after_data(): void {
        parent::definition_after_data();

        if (empty($this->_cm->id)) {
            return;
        }
        $mform = $this->_form;
        $policy = policy_manager::get_by_cmid((int)$this->_cm->id);
        $uid = $this->userid();

        if (!policy_manager::can_edit_field('general', $policy, $this->context, $uid)) {
            foreach (['name', 'introeditor', 'showdescription', 'thumbnail_url', 'poster_filemanager'] as $el) {
                if ($mform->elementExists($el)) {
                    $mform->hardFreeze($el);
                }
            }
        }

        if (!policy_manager::can_edit_field('externalurl', $policy, $this->context, $uid)) {
            foreach (['externalurl', 'param_add'] as $el) {
                if ($mform->elementExists($el)) {
                    $mform->hardFreeze($el);
                }
            }
        }

        if (!policy_manager::can_edit_field('display', $policy, $this->context, $uid)) {
            foreach (['display_mode', 'popup_width', 'popup_height', 'aspect_ratio', 'duration_seconds'] as $el) {
                if ($mform->elementExists($el)) {
                    $mform->hardFreeze($el);
                }
            }
        }

        if (!policy_manager::can_edit_field('completion', $policy, $this->context, $uid)) {
            foreach (['completion', 'completionview', 'completionexpected', 'completionusegrade'] as $el) {
                $name = $el . $this->get_suffix();
                if ($mform->elementExists($name)) {
                    $mform->hardFreeze($name);
                } elseif ($mform->elementExists($el)) {
                    $mform->hardFreeze($el);
                }
            }
        }

        if (!policy_manager::can_edit_field('availability', $policy, $this->context, $uid)) {
            if ($mform->elementExists('availabilityconditionsjson')) {
                $mform->hardFreeze('availabilityconditionsjson');
            }
        }

        // Flatten repeat_elements arrays cleanly into scalar helper fields? Handled via indexed request keys on save.
    }

    /**
     * Validates URL allowing {{token}} placeholders and standard schemes.
     *
     * @param array $data Submitted data.
     * @param array $files Uploaded files.
     * @return array Validation errors.
     */
    public function validation($data, $files): array {
        $errors = parent::validation($data, $files);
        if (!empty($data['externalurl'])) {
            $sanitized = preg_replace('/\{\{[a-z0-9_.-]+\}\}/i', 'placeholder', (string)$data['externalurl']);
            if (!preg_match('|^/|', $sanitized) && !preg_match('|^[a-z]+:|i', $sanitized)) {
                $sanitized = 'http://' . $sanitized;
            }
            if (!preg_match('|^/|', $sanitized) && !url_appears_valid_url($sanitized)) {
                $errors['externalurl'] = get_string('invalidurl', 'smarturl');
            }
        }
        return $errors;
    }

    /**
     * Normalizes repeat_elements array values into scalar properties expected by smarturl_add/update_instance.
     *
     * @return object|null
     */
    public function get_data() {
        $data = parent::get_data();
        if (!$data) {
            return $data;
        }
        foreach (['param_name', 'param_var', 'param_static', 'meta_key', 'meta_customkey', 'meta_val'] as $prefix) {
            if (!empty($data->$prefix) && is_array($data->$prefix)) {
                foreach ($data->$prefix as $idx => $val) {
                    $prop = "{$prefix}_{$idx}";
                    $data->$prop = $val;
                }
            }
        }
        return $data;
    }

    /**
     * Helper returning current actor user ID.
     *
     * @return int
     */
    private function userid(): int {
        global $USER;
        return (int)$USER->id;
    }
}
