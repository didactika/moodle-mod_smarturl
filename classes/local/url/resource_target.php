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

namespace mod_smarturl\local\url;

/**
 * Validates and describes resource targets consistently across presentation surfaces.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class resource_target {
    /**
     * Validates a template or resolved target and adds HTTPS to host-only URLs.
     *
     * @param string $url URL or URL template.
     * @param bool $template Permit unresolved variable syntax.
     * @return string
     */
    public static function normalise(string $url, bool $template = false): string {
        $url = trim($url);
        if ($url === '' || preg_match('/[\x00-\x20\x7f\\\\]/', $url)) {
            throw new \invalid_parameter_exception(get_string('invalidurl', 'smarturl'));
        }
        if (!str_starts_with($url, '/') && !preg_match('~^[a-z][a-z0-9+.-]*:~i', $url)) {
            $url = 'https://' . $url;
        }
        $parsedurl = $template ? preg_replace('/\{\{[a-z0-9_.-]+\}\}/i', 'smarturl-token', $url) : $url;
        if (str_starts_with($parsedurl, '/') && !str_starts_with($parsedurl, '//')) {
            return $url;
        }
        $parsed = parse_url($parsedurl);
        if (
            !$parsed || !in_array(strtolower($parsed['scheme'] ?? ''), ['http', 'https'], true)
                || empty($parsed['host']) || isset($parsed['user']) || isset($parsed['pass'])
                || !filter_var($parsedurl, FILTER_VALIDATE_URL)
        ) {
            throw new \invalid_parameter_exception(get_string('invalidurl', 'smarturl'));
        }
        return $url;
    }

    /**
     * Gets the inline renderer for a resolved target.
     *
     * @param string $url Resolved target.
     * @param bool $allowframe Embed an ordinary web page if explicitly requested.
     * @return array
     */
    public static function describe(string $url, bool $allowframe = false): array {
        $url = self::normalise($url);
        $path = strtolower((string)parse_url($url, PHP_URL_PATH));
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        $host = strtolower((string)parse_url($url, PHP_URL_HOST));
        if (str_starts_with($url, '/')) {
            return ['kind' => 'link', 'url' => $url, 'host' => '', 'poster' => null, 'markup' => ''];
        }
        foreach (\mod_smarturl\plugininfo\smarturlplayer::get_enabled_plugins() as $name) {
            $class = "\\smarturlplayer_{$name}\\player";
            if (is_subclass_of($class, player::class) && ($target = (new $class())->describe($url))) {
                return $target + ['url' => $url, 'host' => $host, 'poster' => null, 'markup' => ''];
            }
        }
        if ($target = self::youtube($url)) {
            return $target;
        }
        $manager = \core_media_manager::instance();
        if ($host && preg_match('/(^|\.)vimeo\.com$/D', $host) && $manager->can_embed_url(new \moodle_url($url))) {
            return ['kind' => 'media', 'url' => $url, 'host' => $host, 'poster' => null, 'markup' => ''];
        }
        $provider = preg_match('/(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be|vimeo\.com)$/D', $host);
        $kind = match (true) {
            in_array($ext, ['mp4', 'm4v', 'webm', 'ogv'], true) => 'video',
            in_array($ext, ['mp3', 'm4a', 'ogg', 'wav', 'flac', 'aac', 'opus'], true) => 'audio',
            in_array($ext, ['gif', 'jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'], true) => 'image',
            $ext === 'pdf' || ($allowframe && !$provider) => 'frame',
            default => 'link',
        };
        return ['kind' => $kind, 'url' => $url, 'host' => $host, 'poster' => null, 'markup' => ''];
    }

    /**
     * Renders a recognised provider using the configured Moodle media player.
     *
     * @param array $target Resource descriptor.
     * @param string $name Accessible resource name.
     * @return array
     */
    public static function with_markup(array $target, string $name): array {
        if ($target['kind'] === 'media' && $target['markup'] === '') {
            $target['markup'] = \core_media_manager::instance()->embed_url(new \moodle_url($target['url']), $name);
        }
        return $target;
    }

    /**
     * Builds the absolute privacy-enhanced URL for a YouTube video.
     *
     * @param string $url Original URL.
     * @return array|null
     */
    public static function youtube(string $url): ?array {
        $videoid = self::youtube_id($url);
        if (!$videoid) {
            return null;
        }
        parse_str((string)parse_url($url, PHP_URL_QUERY), $query);
        $time = self::start_time($query['start'] ?? $query['t'] ?? '');
        $target = new \moodle_url('https://www.youtube-nocookie.com/embed/' . $videoid, $time ? ['start' => $time] : []);
        return ['kind' => 'frame', 'url' => $url, 'embedurl' => $target->out(false), 'host' => parse_url($url, PHP_URL_HOST),
            'poster' => 'https://i.ytimg.com/vi/' . $videoid . '/hqdefault.jpg', 'playable' => true, 'markup' => ''];
    }

    /**
     * Extracts a video ID from recognised YouTube link formats.
     *
     * @param string $url Resolved URL.
     * @return string|null
     */
    private static function youtube_id(string $url): ?string {
        $host = strtolower((string)parse_url($url, PHP_URL_HOST));
        $path = trim((string)parse_url($url, PHP_URL_PATH), '/');
        $id = '';
        if ($host === 'youtu.be') {
            $id = $path;
        } else if (preg_match('/(^|\.)(youtube\.com|youtube-nocookie\.com)$/D', $host)) {
            parse_str((string)parse_url($url, PHP_URL_QUERY), $query);
            if (preg_match('~^(?:shorts|embed|live|v)/([^/]+)$~D', $path, $parts)) {
                $id = $parts[1];
            } else if ($path === 'watch') {
                $id = $query['v'] ?? '';
            }
        }
        return is_string($id) && preg_match('/^[a-zA-Z0-9_-]{11}$/D', $id)
            ? $id : null;
    }

    /**
     * Converts a shared player offset into seconds.
     *
     * @param mixed $value Offset from the URL.
     * @return int
     */
    private static function start_time(mixed $value): int {
        if (!is_string($value)) {
            return 0;
        }
        if (ctype_digit($value)) {
            return min(86400, (int)$value);
        }
        if (preg_match('/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/D', $value, $parts, PREG_UNMATCHED_AS_NULL)) {
            return min(86400, min(24, (int)$parts[1]) * HOURSECS + min(1440, (int)$parts[2]) * MINSECS
                + min(86400, (int)$parts[3]));
        }
        return 0;
    }
}
