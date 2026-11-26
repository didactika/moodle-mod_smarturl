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
 * Reads and stores the translatable content of a resource.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class activity_content {
    /**
     * Returns stored translations indexed by language.
     *
     * @param \stdClass $instance Activity record.
     * @return array
     */
    public static function translations(\stdClass $instance): array {
        return json_decode($instance->translations_json ?? '', true) ?: [];
    }

    /**
     * Normalises translations sent by the editor or an integration.
     *
     * @param array $translations Translations by Moodle language code.
     * @return string|null
     */
    public static function encode(array $translations): ?string {
        $result = [];
        foreach ($translations as $lang => $content) {
            if (!is_string($lang) || !preg_match('/^[a-z0-9_]+$/D', $lang) || !is_array($content)) {
                throw new \invalid_parameter_exception('Invalid resource translation.');
            }
            $title = trim(clean_param($content['title'] ?? '', PARAM_TEXT));
            if (\core_text::strlen($title) > 255) {
                throw new \invalid_parameter_exception('A translated title must contain at most 255 characters.');
            }
            $description = (string)($content['description'] ?? '');
            if ($title !== '' || trim($description) !== '') {
                $result[$lang] = [
                    'title' => $title,
                    'description' => $description,
                    'format' => in_array((int)($content['format'] ?? FORMAT_HTML), [FORMAT_HTML, FORMAT_PLAIN], true)
                        ? (int)($content['format'] ?? FORMAT_HTML)
                        : FORMAT_HTML,
                ];
            }
        }
        return $result ? json_encode($result, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE) : null;
    }

    /**
     * Collects translated text from a form or a web service.
     *
     * @param \stdClass $data Submitted fields.
     * @param \stdClass|null $existing Current activity record.
     * @param \context_module|null $context Activity context for uploaded files.
     * @return string|null
     */
    public static function from_submission(
        \stdClass $data,
        ?\stdClass $existing = null,
        ?\context_module $context = null,
    ): ?string {
        if (property_exists($data, 'translations_json')) {
            return self::encode(json_decode($data->translations_json ?: '{}', true, 512, JSON_THROW_ON_ERROR));
        }
        if (!property_exists($data, 'smu_language')) {
            return $existing->translations_json ?? null;
        }
        $translations = $existing ? self::translations($existing) : [];
        foreach (array_keys(get_string_manager()->get_list_of_translations()) as $lang) {
            $title = 'smu_i18n_' . $lang . '_title';
            $description = 'smu_i18n_' . $lang . '_description';
            if (property_exists($data, $title) || property_exists($data, $description)) {
                $editor = (array)($data->$description ?? []);
                $text = $editor['text'] ?? $translations[$lang]['description'] ?? '';
                $format = (int)($editor['format'] ?? $translations[$lang]['format'] ?? FORMAT_HTML);
                if ($context && !empty($editor['itemid'])) {
                    $text = file_save_draft_area_files(
                        (int)$editor['itemid'],
                        $context->id,
                        'mod_smarturl',
                        'translation',
                        self::file_itemid($lang),
                        ['subdirs' => true],
                        $text
                    );
                }
                $translations[$lang] = [
                    'title' => $data->$title ?? $translations[$lang]['title'] ?? '',
                    'description' => $text,
                    'format' => $format,
                ];
            }
        }
        return self::encode($translations);
    }

    /**
     * Returns a stable item ID for a language within an activity context.
     *
     * @param string $lang Moodle language code.
     * @return int
     */
    public static function file_itemid(string $lang): int {
        return (int)hexdec(substr(hash('sha256', $lang), 0, 7));
    }

    /**
     * Returns the title for the current language.
     *
     * @param \stdClass $instance Activity record.
     * @param string|null $lang Language override for a preview.
     * @return string
     */
    public static function title(\stdClass $instance, ?string $lang = null): string {
        $translation = self::translations($instance)[$lang ?? current_language()] ?? [];
        return ($translation['title'] ?? '') ?: $instance->name;
    }

    /**
     * Formats the description in the activity context or its course for a new draft.
     *
     * @param \stdClass $instance Activity record.
     * @param \context $context Moodle context.
     * @param int $cmid Course module ID.
     * @param string|null $lang Language override for a preview.
     * @return string
     */
    public static function description(\stdClass $instance, \context $context, int $cmid, ?string $lang = null): string {
        $lang = $lang ?? current_language();
        $translation = self::translations($instance)[$lang] ?? [];
        if (trim($translation['description'] ?? '') !== '') {
            $text = $translation['description'];
            if ($cmid) {
                $text = file_rewrite_pluginfile_urls(
                    $text,
                    'pluginfile.php',
                    $context->id,
                    'mod_smarturl',
                    'translation',
                    self::file_itemid($lang)
                );
            }
            return format_text($text, $translation['format'], ['context' => $context]);
        }
        if (empty($instance->intro)) {
            return '';
        }
        if ($cmid && !empty($instance->id)) {
            return format_module_intro('smarturl', $instance, $cmid);
        }
        return format_text($instance->intro, $instance->introformat ?? FORMAT_HTML, ['context' => $context]);
    }
}
