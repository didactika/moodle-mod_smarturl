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

namespace mod_smarturl\hook;

use mod_smarturl\completion\rule_provider;

/**
 * PSR-14 hook dispatched to let plugins register additional Smart URL completion rules.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\core\attribute\label('Collects external completion rule providers for Smart URL activities.')]
final class collect_completion_rules {
    /** @var rule_provider[] */
    private array $providers = [];

    /**
     * Registers an additional completion rule provider.
     *
     * @param rule_provider $provider Rule provider implementation.
     */
    public function register(rule_provider $provider): void {
        $this->providers[$provider->get_rule_key()] = $provider;
    }

    /**
     * Returns all registered providers keyed by rule key.
     *
     * @return array<string, rule_provider>
     */
    public function get_providers(): array {
        return $this->providers;
    }
}
