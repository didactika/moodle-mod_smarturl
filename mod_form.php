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
use mod_smarturl\output\form_builder_widget;

/**
 * Activity settings form for mod_smarturl with conditional fields, Didactika row builders, and policy locks.
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
        global $OUTPUT;

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

        // Display & open behaviour.
        $mform->addElement('header', 'appearancehdr', get_string('appearance', 'smarturl'));
        $displayoptions = [
            'AUTO' => get_string('display_auto', 'smarturl'),
            'NEW' => get_string('display_new', 'smarturl'),
            'OPEN' => get_string('display_open', 'smarturl'),
            'POPUP' => get_string('display_popup', 'smarturl'),
            'EMBED' => get_string('display_embed', 'smarturl'),
            'INLINE_IFRAME' => get_string('display_inline_iframe', 'smarturl'),
            'MODAL' => get_string('display_modal', 'smarturl'),
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
            '16:9' => '16:9 (Widescreen)',
            '4:3' => '4:3 (Classic)',
            '1:1' => '1:1 (Square)',
            '21:9' => '21:9 (Ultrawide)',
        ]);
        $mform->setDefault('aspect_ratio', '16:9');
        foreach (['AUTO', 'NEW', 'OPEN', 'POPUP', 'CARD'] as $nonframe) {
            $mform->hideIf('aspect_ratio', 'display_mode', 'eq', $nonframe);
        }

        // Optional preview card & media details (collapsed unless populated or requested).
        $mform->addElement('header', 'mediahdr', get_string('mediaheader', 'smarturl'));
        $mform->setExpanded('mediahdr', false);

        $mform->addElement('text', 'thumbnail_url', get_string('thumbnailurl', 'smarturl'), ['size' => '80']);
        $mform->setType('thumbnail_url', PARAM_URL);
        $mform->hideIf('thumbnail_url', 'display_mode', 'eq', 'OPEN');
        $mform->hideIf('thumbnail_url', 'display_mode', 'eq', 'NEW');

        $mform->addElement('filemanager', 'poster_filemanager', get_string('posterimage', 'smarturl'), null, [
            'subdirs' => 0,
            'maxfiles' => 1,
            'accepted_types' => ['image'],
        ]);
        $mform->hideIf('poster_filemanager', 'display_mode', 'eq', 'OPEN');
        $mform->hideIf('poster_filemanager', 'display_mode', 'eq', 'NEW');

        $mform->addElement('text', 'duration_seconds', get_string('durationseconds', 'smarturl'), ['size' => '8']);
        $mform->setType('duration_seconds', PARAM_INT);

        // Dynamic URL Parameters (single-line Didactika builder, starts with 1 row).
        $mform->addElement('header', 'dynamicparamshdr', get_string('dynamicparams', 'smarturl'));
        $mform->addElement('static', 'dynamicparamsinfo', '', get_string('dynamicparams_help', 'smarturl'));

        $paramdefs = array_values(array_map(static fn($d) => [
            'shortname' => (string)$d->shortname,
            'name' => (string)$d->name,
            'source_type' => (string)$d->source_type,
            'default_query_param' => (string)($d->default_query_param ?? ''),
        ], param_def_manager::list_all(true)));

        $existingparams = !empty($this->current->parameters_json)
            ? url_resolver::decode_bindings((string)$this->current->parameters_json)
            : [];

        $mform->addElement('hidden', 'parameters_json', '');
        $mform->setType('parameters_json', PARAM_RAW);

        $ctx = $this->form_context();
        $paramslocked = !policy_manager::can_edit_field('externalurl', $this->policy, $ctx, $this->userid());
        $paramswidget = new form_builder_widget(
            'params',
            $existingparams,
            $paramdefs,
            $paramslocked,
            [
                'inserttokens' => get_string('param_insert_tokens', 'smarturl'),
                'paramqueryname' => get_string('param_queryname', 'smarturl'),
                'paramchoose' => get_string('param_choose', 'smarturl'),
                'paramstatic' => get_string('param_staticvalue', 'smarturl'),
                'addrow' => get_string('param_addmore', 'smarturl'),
                'removerow' => get_string('param_remove', 'smarturl'),
                'previewlabel' => get_string('param_preview', 'smarturl'),
            ]
        );
        $mform->addElement('html', html_writer::div($OUTPUT->render($paramswidget), 'mod-smarturl my-2'));

        // Structured Metadata (single-line Didactika builder, starts with 1 row).
        $mform->addElement('header', 'metadatahdr', get_string('metadatasection', 'smarturl'));
        $mform->addElement('static', 'metadatainfo', '', get_string('metadatasection_help', 'smarturl'));

        $metatypes = array_values(array_map(static fn($mt) => [
            'shortname' => (string)$mt->shortname,
            'name' => (string)$mt->name,
            'group' => (string)$mt->group_name,
            'datatype' => (string)$mt->datatype,
        ], metadata_type_manager::list_all(true)));

        $existingmeta = !empty($this->current->id) ? metadata_repository::for_instance((int)$this->current->id, true) : [];

        $mform->addElement('hidden', 'metadata_json', '');
        $mform->setType('metadata_json', PARAM_RAW);

        $metalocked = !policy_manager::can_edit_field('metadata', $this->policy, $ctx, $this->userid());
        $metawidget = new form_builder_widget(
            'metadata',
            $existingmeta,
            $metatypes,
            $metalocked,
            [
                'choose' => get_string('choose', 'moodle'),
                'customkey' => get_string('meta_customkey', 'smarturl'),
                'addrow' => get_string('meta_addmore', 'smarturl'),
                'removerow' => get_string('param_remove', 'smarturl'),
            ]
        );
        $mform->addElement('html', html_writer::div($OUTPUT->render($metawidget), 'mod-smarturl my-2'));

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
        $context = $this->form_context();
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
     * Preprocesses draft poster area, dynamic parameters JSON, metadata JSON, and custom availability.
     *
     * @param array $defaultvalues Default form values.
     */
    public function data_preprocessing(&$defaultvalues): void {
        parent::data_preprocessing($defaultvalues);

        if (!empty($defaultvalues['parameters_json'])) {
            $defaultvalues['parameters_json'] = (string)$defaultvalues['parameters_json'];
        }

        if (!empty($defaultvalues['id'])) {
            $draftitemid = file_get_submitted_draft_itemid('poster_filemanager');
            file_prepare_draft_area($draftitemid, $this->context->id, 'mod_smarturl', 'poster', 0, ['subdirs' => 0, 'maxfiles' => 1]);
            $defaultvalues['poster_filemanager'] = $draftitemid;

            $entries = metadata_repository::for_instance((int)$defaultvalues['id'], true);
            $defaultvalues['metadata_json'] = json_encode(array_map(static fn($e) => [
                'key' => $e['key'],
                'value' => $e['value'],
            ], $entries), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if (!empty($this->_cm->id)) {
            $policy = policy_manager::get_by_cmid((int)$this->_cm->id);
            if ($policy && !empty($policy->managed_availability_json) && !admin_permissions::allows('mod/smarturl:overrideavailability', $this->context)) {
                $defaultvalues['availabilityconditionsjson'] = $policy->custom_availability_json ?? '';
            }
        }
    }

    /**
     * Enforces granular capabilities, administrator restrictions, and external policy field locks after data load.
     */
    public function definition_after_data(): void {
        parent::definition_after_data();

        $mform = $this->_form;
        $ctx = $this->form_context();
        $policy = !empty($this->_cm->id) ? policy_manager::get_by_cmid((int)$this->_cm->id) : null;
        $uid = $this->userid();

        if (!policy_manager::can_edit_field('general', $policy, $ctx, $uid)) {
            foreach (['name', 'introeditor', 'showdescription', 'thumbnail_url', 'poster_filemanager'] as $el) {
                if ($mform->elementExists($el)) {
                    $mform->hardFreeze($el);
                }
            }
        }

        if (!policy_manager::can_edit_field('externalurl', $policy, $ctx, $uid)) {
            foreach (['externalurl', 'parameters_json'] as $el) {
                if ($mform->elementExists($el)) {
                    $mform->hardFreeze($el);
                }
            }
        }

        if (!policy_manager::can_edit_field('display', $policy, $ctx, $uid)) {
            foreach (['display_mode', 'popup_width', 'popup_height', 'aspect_ratio', 'duration_seconds'] as $el) {
                if ($mform->elementExists($el)) {
                    $mform->hardFreeze($el);
                }
            }
        }

        if (!policy_manager::can_edit_field('metadata', $policy, $ctx, $uid)) {
            if ($mform->elementExists('metadata_json')) {
                $mform->hardFreeze('metadata_json');
            }
        }

        if (!policy_manager::can_edit_field('completion', $policy, $ctx, $uid)) {
            foreach (['completion', 'completionview', 'completionexpected', 'completionusegrade'] as $el) {
                $name = $el . $this->get_suffix();
                if ($mform->elementExists($name)) {
                    $mform->hardFreeze($name);
                } elseif ($mform->elementExists($el)) {
                    $mform->hardFreeze($el);
                }
            }
        }

        if (!policy_manager::can_edit_field('availability', $policy, $ctx, $uid)) {
            if ($mform->elementExists('availabilityconditionsjson')) {
                $mform->hardFreeze('availabilityconditionsjson');
            }
        }
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
     * Resolves module context when editing or course context when creating.
     *
     * @return \context
     */
    private function form_context(): \context {
        if (!empty($this->context)) {
            return $this->context;
        }
        if (!empty($this->_cm->id)) {
            return \context_module::instance((int)$this->_cm->id);
        }
        return \context_course::instance((int)($this->current->course ?? $this->_course->id));
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
