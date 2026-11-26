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
 * Contract implemented by smarturlcomp_* subplugins and third-party completion rule providers.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
interface rule_provider {
    /**
     * Unique completion rule identifier (used in form element names and custom_completion).
     *
     * @return string
     */
    public function get_rule_key(): string;

    /**
     * Adds rule controls to the Smart URL activity form.
     *
     * @param \MoodleQuickForm $mform Form object.
     * @param string $suffix Form suffix returned by moodleform_mod::get_suffix().
     * @param \context $context Course or module context.
     * @param bool $locked Whether completion editing is locked by policy or capabilities.
     * @return string[] Element names added to the completion section.
     */
    public function extend_form(\MoodleQuickForm $mform, string $suffix, \context $context, bool $locked): array;

    /**
     * Extracts serializable rule configuration from submitted form data, or null if inactive.
     *
     * @param \stdClass $formdata Submitted data.
     * @param string $suffix Form suffix.
     * @return array<string, mixed>|null
     */
    public function extract_config(\stdClass $formdata, string $suffix): ?array;

    /**
     * Evaluates completion state for a user on a Smart URL course module.
     *
     * @param \cm_info $cm Course module.
     * @param int $userid User ID.
     * @param array<string, mixed> $config Rule configuration stored in completion_custom_json.
     * @return int One of COMPLETION_COMPLETE or COMPLETION_INCOMPLETE.
     */
    public function get_state(\cm_info $cm, int $userid, array $config): int;

    /**
     * Human-readable requirement description shown on the course page.
     *
     * @param array<string, mixed> $config Rule configuration.
     * @return string
     */
    public function get_description(array $config): string;
}
