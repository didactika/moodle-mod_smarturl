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
    $ADMIN->add('modsettings', new admin_externalpage(
        'modsmarturlschema',
        get_string('adminconfiglink', 'smarturl'),
        new moodle_url('/mod/smarturl/admin.php'),
        'mod/smarturl:manageschema'
    ));
}

if ($ADMIN->fulltree) {
    $link = html_writer::link(
        new moodle_url('/mod/smarturl/admin.php'),
        get_string('adminconfiglink', 'smarturl'),
        ['class' => 'btn btn-outline-primary mb-3']
    );
    $settings->add(new admin_setting_heading('mod_smarturl/schema_nav', '', $link));

    $settings->add(new admin_setting_configselect(
        'mod_smarturl/defaultdisplay',
        get_string('defaultdisplaymode', 'smarturl'),
        '',
        'AUTO',
        [
            'AUTO' => get_string('display_auto', 'smarturl'),
            'INLINE_IFRAME' => get_string('display_inline_iframe', 'smarturl'),
            'MODAL' => get_string('display_modal', 'smarturl'),
            'POPUP' => get_string('display_popup', 'smarturl'),
            'EMBED' => get_string('display_embed', 'smarturl'),
            'NEW' => get_string('display_new', 'smarturl'),
            'OPEN' => get_string('display_open', 'smarturl'),
            'CARD' => get_string('display_card', 'smarturl'),
        ]
    ));

    $settings->add(new admin_setting_configtext(
        'mod_smarturl/defaultpopupwidth',
        get_string('defaultpopupwidth', 'smarturl'),
        '',
        1200,
        PARAM_INT
    ));

    $settings->add(new admin_setting_configtext(
        'mod_smarturl/defaultpopupheight',
        get_string('defaultpopupheight', 'smarturl'),
        '',
        800,
        PARAM_INT
    ));

    $settings->add(new admin_setting_heading(
        'mod_smarturl/adminpermissions',
        get_string('adminpermissionsheading', 'smarturl'),
        get_string('adminpermissions_desc', 'smarturl')
    ));

    $settings->add(new admin_setting_configcheckbox(
        'mod_smarturl/lockadmins',
        get_string('lockadmins', 'smarturl'),
        get_string('lockadmins_desc', 'smarturl'),
        0
    ));

    foreach (\mod_smarturl\local\permissions\admin_permissions::CAPABILITIES as $cap => $settingname) {
        $capkey = str_replace('mod/smarturl:', 'smarturl:', $cap);
        $settings->add(new admin_setting_configcheckbox(
            'mod_smarturl/' . $settingname,
            get_string($capkey, 'smarturl'),
            '',
            1
        ));
    }
}
