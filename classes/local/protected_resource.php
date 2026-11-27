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

use context_module;
use context_user;
use moodle_url;
use stored_file;

/**
 * Serves an uploaded copy through Moodle without requesting the external source.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class protected_resource {
    /** @var string Protected file area. */
    public const AREA = 'resource';

    /** @var string[] Types that can be presented without executing a third-party web page. */
    public const TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp3', '.wav', '.ogg', '.mp4', '.webm'];

    /** @var array Moodle MIME types mapped to the inline element. */
    private const KINDS = [
        'application/pdf' => 'frame',
        'image/jpeg' => 'image',
        'image/png' => 'image',
        'image/webp' => 'image',
        'image/gif' => 'image',
        'audio/mpeg' => 'audio',
        'audio/wav' => 'audio',
        'audio/x-wav' => 'audio',
        'audio/ogg' => 'audio',
        'video/mp4' => 'video',
        'video/webm' => 'video',
    ];

    /**
     * Selects a valid file in the current editor's draft area.
     *
     * @param int $draftid Draft area ID.
     * @return stored_file|null
     */
    public static function draft(int $draftid): ?stored_file {
        global $USER;
        if (!$draftid) {
            return null;
        }
        $files = get_file_storage()->get_area_files(context_user::instance($USER->id)->id, 'user', 'draft', $draftid, '', false);
        $file = reset($files);
        return $file && count($files) === 1 && self::kind($file) !== null ? $file : null;
    }

    /**
     * Restricts supported file types by MIME and extension.
     *
     * @param stored_file $file Moodle file.
     * @return string|null
     */
    public static function kind(stored_file $file): ?string {
        $extension = '.' . strtolower(pathinfo($file->get_filename(), PATHINFO_EXTENSION));
        return in_array($extension, self::TYPES, true) ? self::KINDS[$file->get_mimetype()] ?? null : null;
    }

    /**
     * Returns the activity file or fails closed when a copy is unavailable.
     *
     * @param context_module $context Activity context.
     * @return array
     */
    public static function target(context_module $context): array {
        $files = get_file_storage()->get_area_files($context->id, 'mod_smarturl', self::AREA, 0, '', false);
        $file = reset($files);
        $kind = $file ? self::kind($file) : null;
        if (!$kind) {
            throw new \moodle_exception('protectedmissing', 'smarturl');
        }
        $url = moodle_url::make_pluginfile_url(
            $context->id,
            'mod_smarturl',
            self::AREA,
            0,
            $file->get_filepath(),
            $file->get_filename(),
        )->out(false);
        return [
            'url' => $url,
            'embedurl' => $url,
            'kind' => $kind,
            'poster' => null,
            'playable' => in_array($kind, ['audio', 'video'], true),
        ];
    }
}
