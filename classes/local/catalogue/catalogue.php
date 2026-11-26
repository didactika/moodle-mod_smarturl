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

namespace mod_smarturl\local\catalogue;

use mod_smarturl\local\url\resource_target;

/**
 * Lists selectable resources from the enabled catalogue providers.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class catalogue {
    /**
     * Collects a deduplicated set of links for the editor.
     *
     * @param \context_course $context Course context.
     * @return array URL to title.
     */
    public static function choices(\context_course $context): array {
        $options = [];
        foreach (\mod_smarturl\plugininfo\smarturlsource::get_enabled_plugins() as $name) {
            $class = "\\smarturlsource_{$name}\\source";
            if (!is_subclass_of($class, source::class)) {
                continue;
            }
            foreach ((new $class())->resources($context) as $item) {
                try {
                    $url = resource_target::normalise((string)$item['url'], true);
                } catch (\invalid_parameter_exception) {
                    continue;
                }
                $options[$url] = format_string($item['title'], true, ['context' => $context]);
            }
        }
        return $options;
    }
}
