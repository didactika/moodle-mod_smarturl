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

use mod_smarturl\local\url\resource_target;
use moodle_url;

/**
 * Delivers approved remote files through the campus without exposing their origin.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class remote_delivery {
    /** @var int Maximum number of bytes read per request. */
    private const MAX_BYTES = 32 * 1024 * 1024;
    /** @var array Allowed extensions with expected browser and file types. */
    private const TYPES = [
        'pdf' => ['frame', ['application/pdf']],
        'jpg' => ['image', ['image/jpeg']],
        'jpeg' => ['image', ['image/jpeg']],
        'png' => ['image', ['image/png']],
        'gif' => ['image', ['image/gif']],
        'webp' => ['image', ['image/webp']],
        'mp3' => ['audio', ['audio/mpeg']],
        'wav' => ['audio', ['audio/x-wav', 'audio/wav']],
        'ogg' => ['audio', ['audio/ogg', 'application/ogg']],
        'mp4' => ['video', ['video/mp4']],
        'webm' => ['video', ['video/webm']],
    ];

    /**
     * Validates the host and selects an allowed file type.
     *
     * @param string $url Remote address.
     * @return string
     */
    public static function validate(string $url): string {
        $parts = parse_url(resource_target::normalise($url, true));
        $host = strtolower($parts['host'] ?? '');
        $allowed = preg_split('/[\s,]+/', strtolower((string)get_config('mod_smarturl', 'deliveryhosts')), -1, PREG_SPLIT_NO_EMPTY);
        $extension = strtolower(pathinfo($parts['path'] ?? '', PATHINFO_EXTENSION));
        if (
            ($parts['scheme'] ?? '') !== 'https'
            || !in_array($host, $allowed, true)
            || isset($parts['user']) || isset($parts['pass'])
            || (isset($parts['port']) && $parts['port'] !== 443)
            || filter_var($host, FILTER_VALIDATE_IP)
            || !filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME)
            || !isset(self::TYPES[$extension])
        ) {
            throw new \moodle_exception('deliveryinvalid', 'smarturl');
        }
        return $extension;
    }

    /**
     * Builds a same-site descriptor for the viewer.
     *
     * @param string $url Resolved origin.
     * @param int $cmid Activity ID.
     * @return array
     */
    public static function target(string $url, int $cmid): array {
        $extension = self::validate($url);
        $kind = self::TYPES[$extension][0];
        $local = (new moodle_url('/mod/smarturl/delivery.php', ['id' => $cmid]))->out(false);
        return [
            'kind' => $kind, 'url' => $local, 'embedurl' => $local, 'poster' => null,
            'playable' => in_array($kind, ['audio', 'video'], true),
        ];
    }

    /**
     * Fetches and serves one validated binary response.
     *
     * @param string $url Resolved origin.
     */
    public static function send(string $url): void {
        global $CFG;
        require_once($CFG->libdir . '/filelib.php');
        $extension = self::validate($url);
        $file = make_request_directory() . '/resource';
        $stream = fopen($file, 'wb');
        $total = 0;
        $curl = new \curl();
        try {
            $curl->get($url, [], [
                'CURLOPT_FOLLOWLOCATION' => false,
                'CURLOPT_CONNECTTIMEOUT' => 5,
                'CURLOPT_TIMEOUT' => 20,
                'CURLOPT_MAXFILESIZE' => self::MAX_BYTES,
                'CURLOPT_WRITEFUNCTION' => static function ($handle, string $bytes) use ($stream, &$total): int {
                    $total += strlen($bytes);
                    return $total <= self::MAX_BYTES ? (int)fwrite($stream, $bytes) : 0;
                },
            ]);
        } finally {
            fclose($stream);
        }

        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file);
        $status = $curl->get_info()['http_code'] ?? 0;
        if ($curl->get_errno() || $status !== 200 || !in_array($mime, self::TYPES[$extension][1], true)) {
            throw new \moodle_exception('deliveryfailed', 'smarturl');
        }

        header('X-Content-Type-Options: nosniff');
        send_file($file, 'resource.' . $extension, 0, 0, false, false, $mime);
    }
}
