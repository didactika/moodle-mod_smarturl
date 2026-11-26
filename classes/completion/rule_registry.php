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

namespace mod_smarturl\completion;

/**
 * Discovers completion rule providers from installed smarturlcomp_* subplugins and PSR-14 hooks.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class rule_registry {
    /**
     * Collects all enabled rule providers keyed by rule key.
     *
     * @return array<string, rule_provider>
     */
    public static function providers(): array {
        $providers = [];
        $subplugins = \mod_smarturl\plugininfo\smarturlcomp::get_enabled_plugins();
        foreach (array_keys($subplugins) as $name) {
            $class = "\\smarturlcomp_{$name}\\completion\\rule_provider";
            if (class_exists($class) && is_subclass_of($class, rule_provider::class)) {
                $instance = new $class();
                $providers[$instance->get_rule_key()] ??= $instance;
            }
        }

        if (class_exists(\core\hook\manager::class)) {
            $hook = new \mod_smarturl\hook\collect_completion_rules();
            \core\di::get(\core\hook\manager::class)->dispatch($hook);
            foreach ($hook->get_providers() as $key => $provider) {
                $providers[$key] ??= $provider;
            }
        }

        return $providers;
    }
}
