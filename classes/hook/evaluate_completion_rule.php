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

/**
 * PSR-14 hook dispatched when evaluating a dynamic/hook-provided custom completion rule.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
#[\core\attribute\label('Evaluates a custom completion rule for a Smart URL activity.')]
final class evaluate_completion_rule {
    /** @var int|null Override state set by a hook listener. */
    private ?int $state = null;

    /**
     * Constructor.
     *
     * @param \cm_info $cm Course module.
     * @param int $userid User ID.
     * @param string $rulekey Rule key.
     * @param array $config Rule configuration.
     */
    public function __construct(
        /** @var \cm_info Course module. */
        public readonly \cm_info $cm,
        /** @var int User whose rule is evaluated. */
        public readonly int $userid,
        /** @var string Rule key. */
        public readonly string $rulekey,
        /** @var array Rule configuration. */
        public readonly array $config,
    ) {
    }

    /**
     * Sets the evaluated completion state.
     *
     * @param int $state Completion state constant.
     */
    public function set_state(int $state): void {
        $this->state = $state;
    }

    /**
     * Returns the evaluated state, if set by a listener.
     *
     * @return int|null
     */
    public function get_state(): ?int {
        return $this->state;
    }
}
