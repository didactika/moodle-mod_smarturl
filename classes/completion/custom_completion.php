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

declare(strict_types=1);

namespace mod_smarturl\completion;

use core_completion\activity_custom_completion;

/**
 * Custom completion evaluator delegating to installed smarturlcomp_* subplugins and hooks.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class custom_completion extends activity_custom_completion {
    /**
     * Fetches the completion state for a given custom completion rule.
     *
     * @param string $rule Completion rule name.
     * @return int Completion state constant.
     */
    public function get_state(string $rule): int {
        $this->validate_rule($rule);

        $customdata = (array)$this->cm->get_custom_data();
        $config = (array)($customdata['customcompletionrules'][$rule] ?? []);
        $providers = rule_registry::providers();

        if (isset($providers[$rule])) {
            return $providers[$rule]->get_state($this->cm, $this->userid, $config);
        }

        if (class_exists(\core\hook\manager::class)) {
            $hook = new \mod_smarturl\hook\evaluate_completion_rule($this->cm, $this->userid, $rule, $config);
            \core\di::get(\core\hook\manager::class)->dispatch($hook);
            if ($hook->get_state() !== null) {
                return $hook->get_state();
            }
        }

        return COMPLETION_INCOMPLETE;
    }

    /**
     * Fetches all custom completion rules supported by this Moodle site's providers.
     *
     * @return array
     */
    public static function get_defined_custom_rules(): array {
        return array_keys(rule_registry::providers());
    }

    /**
     * Returns descriptions for the custom completion rules active on this instance.
     *
     * @return array
     */
    public function get_custom_rule_descriptions(): array {
        $customdata = (array)$this->cm->get_custom_data();
        $configured = (array)($customdata['customcompletionrules'] ?? []);
        $providers = rule_registry::providers();

        $out = [];
        foreach ($configured as $rule => $config) {
            if (isset($providers[$rule]) && is_array($config)) {
                $out[$rule] = $providers[$rule]->get_description($config);
            }
        }
        return $out;
    }

    /**
     * Returns display order of completion rules.
     *
     * @return array
     */
    public function get_sort_order(): array {
        return array_merge(['completionview'], self::get_defined_custom_rules());
    }
}
