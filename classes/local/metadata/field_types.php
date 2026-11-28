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

namespace mod_smarturl\local\metadata;

use mod_smarturl\local\url\resource_target;

/**
 * Discovers installed types and normalises built-in metadata values.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class field_types {
    /** @var array Installed field types, keyed by type code. */
    private static array $extensions = [];

    /**
     * Installed metadata types.
     *
     * @return field_type[]
     */
    public static function extensions(): array {
        foreach (\mod_smarturl\plugininfo\smarturlmeta::get_enabled_plugins() as $name) {
            $class = "\\smarturlmeta_{$name}\\field_type";
            if (is_subclass_of($class, field_type::class)) {
                $type = new $class();
                $key = $type->key();
                if (preg_match('/^[A-Z][A-Z0-9_]{1,23}$/D', $key) && !in_array($key, metadata_type_manager::DATATYPES, true)) {
                    self::$extensions[$key] ??= $type;
                }
            }
        }
        return self::$extensions;
    }

    /**
     * Validates a submitted value using the selected schema.
     *
     * @param string $type Metadata type.
     * @param string $value Submitted value.
     * @return string
     */
    public static function normalise(string $type, string $value): string {
        $extension = self::extensions()[$type] ?? null;
        if ($extension) {
            return $extension->normalise($value);
        }
        $value = trim($value);
        $valid = match ($type) {
            'NUMBER' => is_numeric($value),
            'DATE' => self::is_date($value),
            'DURATION' => preg_match('/^(\d+|\d{1,3}(:[0-5]\d){1,2})$/D', $value),
            'BOOLEAN' => in_array(strtolower($value), ['1', '0', 'true', 'false', 'yes', 'no'], true),
            default => true,
        };
        if (!$valid) {
            throw new \invalid_parameter_exception(get_string('invalidmetadata', 'smarturl', $type));
        }
        if ($type === 'URL') {
            return resource_target::normalise($value);
        }
        if ($type === 'BOOLEAN') {
            return in_array(strtolower($value), ['1', 'true', 'yes'], true) ? '1' : '0';
        }
        return $value;
    }

    /**
     * Checks a calendar date in ISO order.
     *
     * @param string $value Submitted date.
     * @return bool
     */
    private static function is_date(string $value): bool {
        return preg_match('/^(\d{4})-(\d{2})-(\d{2})$/D', $value, $parts)
            && checkdate((int)$parts[2], (int)$parts[3], (int)$parts[1]);
    }
}
