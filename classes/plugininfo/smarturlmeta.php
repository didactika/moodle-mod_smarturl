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

namespace mod_smarturl\plugininfo;

use core\plugininfo\base;
use core_plugin_manager;

/**
 * Subplugin info class for Smart URL metadata types (smarturlmeta_*).
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class smarturlmeta extends base {
    /**
     * Indicates whether this subplugintype supports enabling/disabling.
     *
     * @return bool
     */
    public static function plugintype_supports_disabling(): bool {
        return true;
    }

    /**
     * Returns all enabled smarturlmeta subplugins.
     *
     * @return array<string, string>|null
     */
    public static function get_enabled_plugins(): ?array {
        $plugins = core_plugin_manager::instance()->get_installed_plugins('smarturlmeta');
        if (!$plugins) {
            return [];
        }
        $enabled = [];
        foreach (array_keys($plugins) as $plugin) {
            if (!get_config('smarturlmeta_' . $plugin, 'disabled')) {
                $enabled[$plugin] = $plugin;
            }
        }
        return $enabled;
    }

    /**
     * Enables or disables a metadata type subplugin.
     *
     * @param string $pluginname Subplugin shortname.
     * @param int $enabled Truthy to enable, falsy to disable.
     * @return bool
     */
    public static function enable_plugin(string $pluginname, int $enabled): bool {
        $plugin = 'smarturlmeta_' . $pluginname;
        $oldvalue = get_config($plugin, 'disabled');
        $disabled = (int)!$enabled;
        if ($oldvalue === false || ((bool)$oldvalue !== (bool)$disabled)) {
            set_config('disabled', $disabled, $plugin);
            add_to_config_log('disabled', $oldvalue, $disabled, $plugin);
            core_plugin_manager::reset_caches();
            return true;
        }
        return false;
    }

    /**
     * Whether uninstalling subplugins is permitted.
     *
     * @return bool
     */
    public function is_uninstall_allowed(): bool {
        return true;
    }
}
