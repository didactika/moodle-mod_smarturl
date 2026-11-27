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

namespace mod_smarturl\local;

use core\plugininfo\base;
use moodle_url;

/**
 * Connects extension settings to Moodle's administration tree.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class subplugins {
    /** @var string[] Smart URL extension types. */
    public const TYPES = ['smarturlplayer', 'smarturlmeta', 'smarturlsource', 'smarturlcomp'];

    /**
     * Returns the registered settings URL if the extension provides one.
     *
     * @param base $plugin Moodle plugin information.
     * @return moodle_url|null
     */
    public static function settings_url(base $plugin): ?moodle_url {
        $url = $plugin->get_settings_url();
        if ($url) {
            return $url;
        }
        if (is_readable($plugin->rootdir . '/settings.php')) {
            return new moodle_url('/admin/settings.php', ['section' => 'modsmarturl_' . $plugin->component]);
        }
        return null;
    }

    /**
     * Registers standalone settings pages for installed extensions that supply settings.php.
     *
     * @param \admin_root $adminroot Site administration.
     * @param string $parent Admin category that receives the pages.
     */
    public static function register_settings(\admin_root $adminroot, string $parent = 'modsettings'): void {
        foreach (self::TYPES as $type) {
            foreach (\core_plugin_manager::instance()->get_plugins_of_type($type) as $plugin) {
                $file = $plugin->rootdir . '/settings.php';
                if (!is_readable($file)) {
                    continue;
                }
                $section = 'modsmarturl_' . $plugin->component;
                $settings = new \admin_settingpage($section, $plugin->displayname, 'moodle/site:config', true);
                if ($adminroot->fulltree) {
                    $ADMIN = $adminroot;
                    require($file);
                }
                $adminroot->add($parent, $settings);
            }
        }
    }
}
