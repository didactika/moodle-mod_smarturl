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

use mod_smarturl\local\metadata\metadata_repository;
use mod_smarturl\local\url\resource_target;
use mod_smarturl\local\url\url_resolver;

/**
 * Prepares the same resource and metadata for both viewer implementations.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class viewer_data {
    /**
     * Resolves the resource according to its presentation.
     *
     * @param \stdClass $instance Activity.
     * @param \stdClass $course Course.
     * @param \stdClass $user Viewer.
     * @param int $cmid Activity ID.
     * @param array $profile Presentation settings.
     * @return array
     */
    public static function target(\stdClass $instance, \stdClass $course, \stdClass $user, int $cmid, array $profile): array {
        if ($profile['gateway'] && !$profile['deferred']) {
            throw new \moodle_exception('deliveryretired', 'smarturl');
        }
        if ($profile['protected']) {
            return protected_resource::target(\context_module::instance($cmid));
        }
        $url = url_resolver::resolve($instance, $course, $user, $cmid);
        $allowframe = $profile['launch'] === 'INLINE' || in_array($profile['viewer'], ['EMBED', 'MODAL'], true);
        return resource_target::describe($url, $allowframe);
    }

    /**
     * Builds the common presentation payload.
     *
     * @param \stdClass $instance Activity.
     * @param \stdClass $course Course.
     * @param \stdClass $user Viewer.
     * @param \context_module $context Activity context.
     * @return array
     */
    public static function prepare(\stdClass $instance, \stdClass $course, \stdClass $user, \context_module $context): array {
        $cmid = (int)$context->instanceid;
        $profile = presentation::for_instance($instance);
        $name = format_string(activity_content::title($instance), true, ['context' => $context]);
        $target = self::target($instance, $course, $user, $cmid, $profile);
        $viewer = $profile['viewer'];
        if ($target['kind'] === 'link' || $viewer === 'LINK') {
            $mode = 'OPEN';
        } else if ($viewer === 'POSTER' || ($profile['deferred'] && $viewer !== 'MODAL')) {
            $mode = 'INLINE_IFRAME';
        } else if ($viewer === 'MODAL') {
            $mode = 'MODAL';
        } else {
            $mode = 'EMBED';
        }
        $postersource = ($profile['protected'] || $profile['deferred']) ? 'UPLOAD' : $profile['poster'];
        return [
            'name' => $name,
            'intro' => activity_content::description($instance, $context, $cmid),
            'target' => $target,
            'player' => self::player_markup($target, $name, $cmid, $profile['deferred']),
            'mode' => $mode,
            'poster' => self::poster($instance, $context, $postersource, $target['poster']),
            'metadata' => presentation::select_fields(
                metadata_repository::for_instance((int)$instance->id),
                $profile['viewerfields']
            ),
        ];
    }

    /**
     * Returns the resource image according to the configured source.
     *
     * @param \stdClass $instance Activity.
     * @param \context_module $context Activity context.
     * @param string $source Image source.
     * @param string|null $provider Provider image.
     * @return string|null
     */
    public static function poster(\stdClass $instance, \context_module $context, string $source, ?string $provider): ?string {
        if ($source === 'AUTO' || $source === 'UPLOAD') {
            $files = get_file_storage()->get_area_files($context->id, 'mod_smarturl', 'poster', 0, 'id DESC', false);
            if ($files) {
                $file = reset($files);
                return \moodle_url::make_pluginfile_url(
                    $context->id,
                    'mod_smarturl',
                    'poster',
                    0,
                    $file->get_filepath(),
                    $file->get_filename()
                )->out(false);
            }
        }
        if (($source === 'AUTO' || $source === 'URL') && !empty($instance->thumbnail_url)) {
            try {
                return resource_target::normalise($instance->thumbnail_url);
            } catch (\invalid_parameter_exception) {
                return null;
            }
        }
        return $source === 'AUTO' || $source === 'PROVIDER' ? $provider : null;
    }

    /**
     * Builds the embeddable markup used by the course and the Moodle 4.5 viewer.
     *
     * @param array $target Resource descriptor.
     * @param string $title Accessible title.
     * @return string
     */
    public static function render_target(array $target, string $title): string {
        $attributes = ['src' => $target['embedurl'] ?? $target['url']];
        return match ($target['kind']) {
            'media' => $target['markup'],
            'video', 'audio' => \html_writer::tag($target['kind'], '', $attributes + [
                'aria-label' => $title,
                'controls' => true,
                'preload' => 'none',
            ]),
            'image' => \html_writer::empty_tag('img', $attributes + ['alt' => $title, 'loading' => 'lazy']),
            'frame' => \html_writer::tag('iframe', '', $attributes + [
                'title' => $title,
                'loading' => 'lazy',
                'allowfullscreen' => true,
                'allow' => 'autoplay; fullscreen',
                'referrerpolicy' => 'strict-origin-when-cross-origin',
            ]),
            default => '',
        };
    }

    /**
     * Produces player markup for a presentation without exposing a deferred origin.
     *
     * @param array $target Resource descriptor.
     * @param string $title Accessible title.
     * @param int $cmid Activity ID.
     * @param bool $deferred Delay resolving the browser destination.
     * @return string
     */
    public static function player_markup(array $target, string $title, int $cmid, bool $deferred): string {
        if ($deferred && $target['kind'] !== 'link') {
            $local = (new \moodle_url('/mod/smarturl/player.php', ['id' => $cmid]))->out(false);
            $target = ['kind' => $target['kind'] === 'media' ? 'frame' : $target['kind'], 'url' => $local];
        } else {
            $target = resource_target::with_markup($target, $title);
        }
        return self::render_target($target, $title);
    }

    /**
     * Names a recognised resource type for the activity tab.
     *
     * @param array $target Resource descriptor.
     * @return string
     */
    public static function navigation_label(array $target): string {
        $path = (string)parse_url($target['url'], PHP_URL_PATH);
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $type = match (true) {
            in_array($extension, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'csv'], true)
                => strtoupper($extension),
            $target['kind'] === 'image' => get_string('nav_image', 'smarturl'),
            $target['kind'] === 'audio' => get_string('nav_audio', 'smarturl'),
            $target['kind'] === 'video' || $target['kind'] === 'media' || !empty($target['playable'])
                => get_string('nav_video', 'smarturl'),
            default => get_string('modulename', 'smarturl'),
        };
        return $type;
    }
}
