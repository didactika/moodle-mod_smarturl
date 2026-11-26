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

/**
 * Presentation settings shared by the activity, course, and auxiliary viewer.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class presentation {
    /** @var array Supported configuration values and their language string keys. */
    public const OPTIONS = [
        'course' => ['LINK', 'CARD', 'IMAGE'],
        'launch' => ['AUTO', 'ACTIVITY', 'VIEWERTAB', 'VIEWERWINDOW', 'EXTERNAL', 'EXTERNALTAB', 'EXTERNALWINDOW', 'INLINE'],
        'viewer' => ['AUTO', 'EMBED', 'POSTER', 'LINK', 'MODAL'],
        'poster' => ['AUTO', 'UPLOAD', 'URL', 'PROVIDER', 'NONE'],
    ];

    /** @var array Boolean configuration keys. */
    public const FLAGS = ['title', 'icon', 'description', 'play'];

    /**
     * Refreshes affected course icons after the administrator changes the setting.
     */
    public static function refresh_course_cache(): void {
        rebuild_course_cache(0, true);
    }

    /**
     * Resolves stored or legacy settings into a complete profile.
     *
     * @param \stdClass $instance Activity record.
     * @return array
     */
    public static function for_instance(\stdClass $instance): array {
        $legacy = self::legacy((string)($instance->display_mode ?? 'AUTO'), !empty($instance->show_description));
        $saved = json_decode($instance->presentation_json ?? '', true);
        return is_array($saved) ? array_replace($legacy, self::validate($saved)) : $legacy;
    }

    /**
     * Maps the original combined display modes to independent settings.
     *
     * @param string $mode Original display mode.
     * @param bool $description Whether the course description is enabled.
     * @return array
     */
    public static function legacy(string $mode, bool $description = false): array {
        [$launch, $viewer] = match ($mode) {
            'NEW' => ['EXTERNALTAB', 'LINK'],
            'OPEN' => ['EXTERNAL', 'LINK'],
            'POPUP' => ['EXTERNALWINDOW', 'LINK'],
            'EMBED' => ['ACTIVITY', 'EMBED'],
            'INLINE_IFRAME' => ['INLINE', 'POSTER'],
            'MODAL' => ['ACTIVITY', 'MODAL'],
            'CARD' => ['ACTIVITY', 'POSTER'],
            default => ['AUTO', 'AUTO'],
        };
        return [
            'course' => $mode === 'CARD' ? 'CARD' : 'LINK',
            'launch' => $launch,
            'viewer' => $viewer,
            'poster' => 'AUTO',
            'title' => true,
            'icon' => true,
            'description' => $description,
            'play' => false,
            'coursefields' => null,
            'viewerfields' => null,
        ];
    }

    /**
     * Validates the submitted settings, preserving omitted options.
     *
     * @param array $input Submitted options.
     * @return array
     */
    public static function validate(array $input): array {
        $validated = [];
        foreach (self::OPTIONS as $key => $options) {
            if (array_key_exists($key, $input)) {
                if (!in_array($input[$key], $options, true)) {
                    throw new \invalid_parameter_exception('Invalid presentation option: ' . $key);
                }
                $validated[$key] = $input[$key];
            }
        }
        foreach (self::FLAGS as $key) {
            if (array_key_exists($key, $input)) {
                $validated[$key] = (bool)$input[$key];
            }
        }
        foreach (['coursefields', 'viewerfields'] as $key) {
            if (!array_key_exists($key, $input)) {
                continue;
            }
            if ($input[$key] !== null && !is_array($input[$key])) {
                throw new \invalid_parameter_exception('Invalid metadata selection: ' . $key);
            }
            $validated[$key] = $input[$key] === null ? null : array_values(array_unique(array_map(
                static fn($field) => clean_param((string)$field, PARAM_ALPHANUMEXT),
                $input[$key]
            )));
        }
        return $validated;
    }

    /**
     * Encodes native form controls or applies a partial API update.
     *
     * @param \stdClass $data Submitted fields.
     * @param \stdClass|null $existing Current activity record.
     * @return string|null
     */
    public static function from_submission(\stdClass $data, ?\stdClass $existing = null): ?string {
        $changes = [];
        if (property_exists($data, 'presentation_json')) {
            $changes = json_decode($data->presentation_json ?: "{}", true, 512, JSON_THROW_ON_ERROR);
        } else {
            foreach (array_merge(array_keys(self::OPTIONS), self::FLAGS) as $key) {
                $field = 'smu_' . $key;
                if (property_exists($data, $field)) {
                    $changes[$key] = $data->$field;
                }
            }
            foreach (['coursefields', 'viewerfields'] as $key) {
                $mode = 'smu_' . $key . 'mode';
                $items = 'smu_' . $key;
                if (property_exists($data, $mode)) {
                    $changes[$key] = match ($data->$mode) {
                        'NONE' => [],
                        'SELECT' => (array)($data->$items ?? []),
                        default => null,
                    };
                }
            }
        }
        if (!$changes) {
            return $existing->presentation_json ?? null;
        }
        $base = $existing ? self::for_instance($existing) : self::legacy($data->display_mode ?? "AUTO");
        return json_encode(array_replace($base, self::validate($changes)), JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Selects visible fields in the requested order.
     *
     * @param array $entries Visible metadata.
     * @param array|null $keys Selected field keys, or null for defaults.
     * @param bool $primaryonly Use primary entries only by default.
     * @return array
     */
    public static function select_fields(array $entries, ?array $keys, bool $primaryonly = false): array {
        if ($keys === null) {
            return $primaryonly
                ? array_slice(array_values(array_filter($entries, static fn($entry) => $entry['priority'] === 'PRIMARY')), 0, 3)
                : $entries;
        }

        $ordered = [];
        $bykey = [];
        foreach ($entries as $entry) {
            $bykey[$entry['key']][] = $entry;
        }
        foreach ($keys as $key) {
            array_push($ordered, ...($bykey[$key] ?? []));
        }
        return $ordered;
    }
}
