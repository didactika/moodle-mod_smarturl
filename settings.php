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
 * Site administration settings for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    // Group every Smart URL page under one category, like other activities with several pages.
    $hidden = $module->is_enabled() === false;
    $ADMIN->add('modsettings', new admin_category('modsmarturlfolder', new lang_string('pluginname', 'smarturl'), $hidden));
    $settings = new admin_settingpage($section, get_string('generalsettings', 'admin'), 'moodle/site:config', $hidden);
    $ADMIN->add('modsmarturlfolder', $settings);

    $ADMIN->add('modsmarturlfolder', new admin_externalpage(
        'modsmarturlschema',
        get_string('adminconfiglink', 'smarturl'),
        new moodle_url('/mod/smarturl/admin.php'),
        'mod/smarturl:manageschema'
    ));
    $ADMIN->add('modsmarturlfolder', new admin_externalpage(
        'modsmarturlplugins',
        get_string('manageplugins', 'smarturl'),
        new moodle_url('/mod/smarturl/plugins.php'),
    ));
    \mod_smarturl\local\subplugins::register_settings($ADMIN, 'modsmarturlfolder');
}

if ($ADMIN->fulltree) {
    // This heading also loads the design-system select menus for the page.
    $settings->add(new \mod_smarturl\local\settings_heading(
        'mod_smarturl/defaultappearance_heading',
        get_string('defaultappearance', 'smarturl'),
        get_string('defaultappearance_desc', 'smarturl'),
    ));

    $mimeicons = new admin_setting_configcheckbox(
        'mod_smarturl/usemimeicons',
        get_string('usemimeicons', 'smarturl'),
        get_string('usemimeicons_desc', 'smarturl'),
        1
    );
    $mimeicons->set_updatedcallback([\mod_smarturl\local\presentation::class, 'refresh_course_cache']);
    $settings->add($mimeicons);
    $settings->add(new \mod_smarturl\local\help_select_setting(
        'mod_smarturl/defaultcoursestyle',
        get_string('presentation_course', 'smarturl'),
        get_string('presentation_course_desc', 'smarturl'),
        'LINK',
        array_combine(['LINK', 'CARD', 'IMAGE'], array_map(static fn($option) =>
            get_string('course_' . strtolower($option), 'smarturl'), ['LINK', 'CARD', 'IMAGE'])),
        'presentation_course',
    ));
    foreach (['launch', 'viewer', 'poster'] as $key) {
        $choices = [];
        foreach (\mod_smarturl\local\presentation::OPTIONS[$key] as $choice) {
            $choices[$choice] = get_string($key . '_' . strtolower($choice), 'smarturl');
        }
        $settings->add(new \mod_smarturl\local\help_select_setting(
            'mod_smarturl/default' . $key,
            get_string('presentation_' . $key, 'smarturl'),
            get_string('presentation_' . $key . '_desc', 'smarturl'),
            'AUTO',
            $choices,
            'presentation_' . $key,
        ));
    }
    $settings->add(new admin_setting_heading(
        'mod_smarturl/window_heading',
        get_string('defaultwindowsize', 'smarturl'),
        get_string('defaultwindowsize_desc', 'smarturl'),
    ));
    foreach (['width' => 1200, 'height' => 800] as $dimension => $value) {
        $settings->add(new admin_setting_configtext(
            'mod_smarturl/defaultpopup' . $dimension,
            get_string('defaultpopup' . $dimension, 'smarturl'),
            '',
            $value,
            PARAM_INT,
        ));
    }
    $pages = [
        'adminconfiglink' => ['/mod/smarturl/admin.php', 'settingscatalogue_help'],
        'manageplugins' => ['/mod/smarturl/plugins.php', 'manageplugins_help'],
    ];
    $items = [];
    foreach ($pages as $title => [$url, $description]) {
        $items[] = html_writer::link(new moodle_url($url), get_string($title, 'smarturl'))
            . ': ' . get_string($description, 'smarturl');
    }
    $settings->add(new admin_setting_heading(
        'mod_smarturl/morepages_heading',
        get_string('morepages', 'smarturl'),
        html_writer::alist($items),
    ));
}

// The page is already in the Smart URL category, so Moodle must not add it again.
$settings = null;
