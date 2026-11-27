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
 * Displays installed Smart URL extensions and applies status changes.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require('../../config.php');
require_once($CFG->libdir . '/adminlib.php');

use mod_smarturl\local\subplugins;

admin_externalpage_setup('modsmarturlplugins');
require_capability('moodle/site:config', context_system::instance());
$PAGE->set_title(get_string('manageplugins', 'smarturl'));
$PAGE->set_heading(get_string('manageplugins', 'smarturl'));
$manager = core_plugin_manager::instance();
$url = new moodle_url('/mod/smarturl/plugins.php');

if (data_submitted()) {
    require_sesskey();
    $component = required_param('component', PARAM_COMPONENT);
    [$type, $name] = core_component::normalize_component($component);
    $plugin = $manager->get_plugin_info($component);
    if (!$plugin || !in_array($type, subplugins::TYPES, true) || !isset($manager->get_installed_plugins($type)[$name])) {
        throw new moodle_exception('invalidplugin', 'smarturl');
    }
    $plugin::enable_plugin($name, (int)required_param('enabled', PARAM_BOOL));
    redirect($url, get_string('changessaved'));
}

$groups = [];
foreach (subplugins::TYPES as $type) {
    $group = ['name' => get_string('subplugintype_' . $type . '_plural', 'smarturl'), 'plugins' => []];
    foreach ($manager->get_installed_plugins($type) as $name => $version) {
        $plugin = $manager->get_plugin_info($type . '_' . $name);
        if (!$plugin) {
            continue;
        }
        $active = $plugin->is_enabled() !== false;
        $settings = subplugins::settings_url($plugin);
        $group['plugins'][] = [
            'name' => $plugin->displayname,
            'component' => $plugin->component,
            'status' => get_string($active ? 'enabled' : 'disabled', 'smarturl'),
            'active' => $active,
            'enabled' => (int)!$active,
            'toggle' => get_string($active ? 'disable' : 'enable'),
            'settingsurl' => $settings ? $settings->out(false) : '',
        ];
    }
    if ($group['plugins']) {
        $groups[] = $group;
    }
}

echo $OUTPUT->header();
echo $PAGE->get_renderer('mod_smarturl')->render_from_template('mod_smarturl/subplugins', [
    'groups' => $groups,
    'hasgroups' => !empty($groups),
    'action' => $url->out(false),
    'sesskey' => sesskey(),
]);
echo $OUTPUT->footer();
