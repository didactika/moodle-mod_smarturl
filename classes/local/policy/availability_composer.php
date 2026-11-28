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

namespace mod_smarturl\local\policy;

/**
 * Composes and splits two-branch Moodle availability trees (externally managed + course-local custom restrictions).
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class availability_composer {
    /**
     * Combines an externally managed availability tree and a course-local branch with logical AND.
     *
     * @param string|null $managedjson Managed availability JSON tree.
     * @param string|null $customjson Course-local custom availability JSON tree.
     * @return string|null Combined Moodle course_modules.availability JSON.
     */
    public static function compose(?string $managedjson, ?string $customjson): ?string {
        $managed = self::decode_tree($managedjson);
        $custom = self::decode_tree($customjson);

        if ($managed === null && $custom === null) {
            return null;
        }
        if ($managed !== null && $custom === null) {
            return json_encode($managed, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
        if ($managed === null && $custom !== null) {
            return json_encode($custom, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        // Preserve any external branch alongside user-authored course restrictions.
        return json_encode([
            'op' => '&',
            'c' => [$managed, $custom],
            'showc' => [false, true],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Rejects malformed external availability updates.
     *
     * @param string|null $json Availability tree.
     */
    public static function validate_external(?string $json): void {
        if ($json === null || trim($json) === '') {
            return;
        }
        $tree = json_decode($json);
        if (
            !is_object($tree) || !isset($tree->c) || !is_array($tree->c) || !in_array(
                $tree->op ?? '',
                ['&', '|', '!&', '!|'],
                true,
            )
        ) {
            throw new \invalid_parameter_exception('Invalid availability tree.');
        }
    }

    /**
     * Normalizes an availability JSON string; treats empty condition trees as null.
     *
     * @param string|null $json Availability JSON.
     * @return array<string, mixed>|null
     */
    public static function decode_tree(?string $json): ?array {
        if ($json === null || trim($json) === '') {
            return null;
        }
        $decoded = json_decode($json, true);
        if (!is_array($decoded) || !isset($decoded['c']) || !is_array($decoded['c'])) {
            return null;
        }
        if (count($decoded['c']) === 0) {
            return null;
        }
        return $decoded;
    }

    /**
     * Extracts the course-local branch from a combined availability JSON tree when an external branch exists.
     *
     * @param string|null $combinedjson Combined Moodle course_modules.availability JSON.
     * @param string|null $managedjson Known externally managed branch JSON.
     * @return string|null Extracted custom branch JSON.
     */
    public static function extract_custom(?string $combinedjson, ?string $managedjson): ?string {
        $combined = self::decode_tree($combinedjson);
        if ($combined === null) {
            return null;
        }
        $managed = self::decode_tree($managedjson);
        if ($managed === null) {
            return json_encode($combined, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if (($combined['op'] ?? '') === '&' && count($combined['c']) === 2 && self::same_tree($combined['c'][0], $managed)) {
            $custom = self::decode_tree(json_encode($combined['c'][1]));
            return $custom !== null ? json_encode($custom, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : null;
        }
        if (self::same_tree($combined, $managed)) {
            return null;
        }
        return json_encode($combined, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Structural comparison helper.
     *
     * @param mixed $a First tree node.
     * @param mixed $b Second tree node.
     * @return bool
     */
    private static function same_tree(mixed $a, mixed $b): bool {
        return json_encode($a) === json_encode($b);
    }
}
