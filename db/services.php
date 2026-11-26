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
 * External web service definitions for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$functions = [
    'mod_smarturl_get_editor_context' => [
        'classname' => \mod_smarturl\external\get_editor_context::class,
        'description' => 'Loads the configuration for an editable Smart URL resource.',
        'type' => 'read',
        'ajax' => true,
    ], 'mod_smarturl_save_instances' => [
        'classname' => \mod_smarturl\external\save_instances::class,
        'description' => 'Saves a batch of complete Smart URL resources with a result per item.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:manageexternal',
        'ajax' => false,
    ],
    'mod_smarturl_create_instances' => [
        'classname' => \mod_smarturl\external\create_instances::class,
        'description' => 'Creates one or more Smart URL module instances with policy, parameters and metadata.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:manageexternal, mod/smarturl:addinstance',
        'ajax' => false,
    ],
    'mod_smarturl_update_instances' => [
        'classname' => \mod_smarturl\external\update_instances::class,
        'description' => 'Updates one or more Smart URL module instances with policy, availability and metadata.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:manageexternal',
        'ajax' => false,
    ],
    'mod_smarturl_delete_instances' => [
        'classname' => \mod_smarturl\external\delete_instances::class,
        'description' => 'Deletes Smart URL module instances by cmid or idnumber.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:manageexternal',
        'ajax' => false,
    ],
    'mod_smarturl_get_instances' => [
        'classname' => \mod_smarturl\external\get_instances::class,
        'description' => 'Lists Smart URL module instances for one or more courses including policy and metadata.',
        'type' => 'read',
        'capabilities' => 'mod/smarturl:manageexternal',
        'ajax' => false,
    ],
    'mod_smarturl_get_overrides' => [
        'classname' => \mod_smarturl\external\get_overrides::class,
        'description' => 'Returns instances whose local_revision exceeds acked_revision for manual recovery.',
        'type' => 'read',
        'capabilities' => 'mod/smarturl:manageexternal',
        'ajax' => false,
    ],
    'mod_smarturl_track_view' => [
        'classname' => \mod_smarturl\external\track_view::class,
        'description' => 'Records view completion and logs a Smart URL view event.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:view',
        'ajax' => true,
    ],
    'mod_smarturl_get_metadata' => [
        'classname' => \mod_smarturl\external\get_metadata::class,
        'description' => 'Returns typed and grouped metadata entries for a Smart URL instance with search and filter support.',
        'type' => 'read',
        'capabilities' => 'mod/smarturl:view',
        'ajax' => true,
    ],
    'mod_smarturl_save_meta_type' => [
        'classname' => \mod_smarturl\external\save_meta_type::class,
        'description' => 'Creates or updates a configurable metadata type.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:manageschema',
        'ajax' => true,
    ],
    'mod_smarturl_delete_meta_type' => [
        'classname' => \mod_smarturl\external\delete_meta_type::class,
        'description' => 'Deletes a configurable metadata type.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:manageschema',
        'ajax' => true,
    ],
    'mod_smarturl_save_param_def' => [
        'classname' => \mod_smarturl\external\save_param_def::class,
        'description' => 'Creates or updates a dynamic URL parameter definition.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:manageschema',
        'ajax' => true,
    ],
    'mod_smarturl_delete_param_def' => [
        'classname' => \mod_smarturl\external\delete_param_def::class,
        'description' => 'Deletes a dynamic URL parameter definition.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:manageschema',
        'ajax' => true,
    ],
    'mod_smarturl_preview_url' => [
        'classname' => \mod_smarturl\external\preview_url::class,
        'description' => 'Resolves a URL template and parameter bindings for previewing dynamic parameters.',
        'type' => 'read',
        'capabilities' => 'mod/smarturl:manageschema',
        'ajax' => true,
    ],
    'mod_smarturl_list_meta_types' => [
        'classname' => \mod_smarturl\external\list_meta_types::class,
        'description' => 'Lists configured metadata type definitions.',
        'type' => 'read',
        'capabilities' => 'mod/smarturl:manageschema, mod/smarturl:manageexternal',
        'ajax' => true,
    ],
    'mod_smarturl_list_param_defs' => [
        'classname' => \mod_smarturl\external\list_param_defs::class,
        'description' => 'Lists configured dynamic URL variable definitions.',
        'type' => 'read',
        'capabilities' => 'mod/smarturl:manageschema, mod/smarturl:manageexternal',
        'ajax' => true,
    ],
    'mod_smarturl_set_metadata' => [
        'classname' => \mod_smarturl\external\set_metadata::class,
        'description' => 'Replaces or merges metadata entries on a Smart URL instance.',
        'type' => 'write',
        'capabilities' => 'mod/smarturl:editmetadata, mod/smarturl:manageexternal',
        'ajax' => true,
    ],
];

$services = [
    'Smart URL External API' => [
        'functions' => array_keys($functions),
        'restrictedusers' => 1,
        'enabled' => 1,
        'shortname' => 'mod_smarturl',
    ],
];
