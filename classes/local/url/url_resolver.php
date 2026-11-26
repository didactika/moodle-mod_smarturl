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
 * Resolves dynamic URL parameters and {{placeholder}} templates against Moodle course, user and custom field context.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class url_resolver {
    /**
     * Resolves a Smart URL record for a specific user and course module context.
     *
     * @param \stdClass $instance Record from {smarturl}.
     * @param \stdClass $course Course record.
     * @param \stdClass $user User record.
     * @param int $cmid Course module ID (0 if previewing before creation).
     * @return string Fully resolved external URL.
     */
    public static function resolve(\stdClass $instance, \stdClass $course, \stdClass $user, int $cmid = 0): string {
        $bindings = self::decode_bindings($instance->parameters_json ?? null);
        return self::preview((string)$instance->externalurl, $bindings, $course, $user, $cmid);
    }

    /**
     * Resolves an arbitrary template URL and parameter binding list.
     *
     * @param string $template Raw external URL possibly containing {{shortname}} placeholders.
     * @param array<int, array<string, mixed>> $bindings Query parameter bindings.
     * @param \stdClass $course Course record.
     * @param \stdClass $user User record.
     * @param int $cmid Course module ID.
     * @return string Resolved URL.
     */
    public static function preview(
        string $template,
        array $bindings,
        \stdClass $course,
        \stdClass $user,
        int $cmid = 0,
    ): string {
        global $DB;

        preg_match_all('/\{\{([a-z0-9_.-]+)\}\}/i', $template, $matches);
        $keys = $matches[1];
        foreach ($bindings as $binding) {
            if (($binding['mode'] ?? 'def') !== 'static' && !empty($binding['var'])) {
                $keys[] = $binding['var'];
            }
        }
        $keys = array_values(array_unique(array_map('strtolower', $keys)));
        $defs = $keys ? $DB->get_records_list('smarturl_param_def', 'shortname', $keys, 'sortorder ASC, id ASC') : [];
        $values = self::compute_values($defs, $course, $user, $cmid);

        // Preserve URL fragment while substituting tokens and appending query parameters.
        $fragment = '';
        $hashpos = strpos($template, '#');
        if ($hashpos !== false) {
            $fragment = substr($template, $hashpos);
            $template = substr($template, 0, $hashpos);
        }

        $resolved = preg_replace_callback('/\{\{([a-z0-9_.-]+)\}\}/i', static function (array $m) use ($values): string {
            $key = strtolower($m[1]);
            if (!array_key_exists($key, $values)) {
                return '';
            }
            return rawurlencode((string)$values[$key]);
        }, $template) ?? $template;

        if (empty($bindings)) {
            return $resolved . $fragment;
        }

        $querypairs = [];
        foreach ($bindings as $binding) {
            $param = trim((string)($binding['param'] ?? ''));
            if ($param === '') {
                continue;
            }
            if (($binding['mode'] ?? 'def') === 'static') {
                $val = (string)($binding['value'] ?? '');
            } else {
                $defkey = strtolower(trim((string)($binding['var'] ?? '')));
                $val = (string)($values[$defkey] ?? '');
            }
            $querypairs[] = rawurlencode($param) . '=' . rawurlencode($val);
        }

        if (empty($querypairs)) {
            return $resolved . $fragment;
        }

        $sep = str_contains($resolved, '?') ? (str_ends_with($resolved, '?') || str_ends_with($resolved, '&') ? '' : '&') : '?';
        return $resolved . $sep . implode('&', $querypairs) . $fragment;
    }

    /**
     * Resolves a draft using synthetic values for Moodle variables.
     *
     * @param string $template Submitted URL.
     * @param array $bindings Submitted query bindings.
     * @return string
     */
    public static function preview_sample(string $template, array $bindings): string {
        $sample = preg_replace('/\{\{[a-z0-9_.-]+\}\}/i', 'sample-value', $template) ?? $template;
        foreach ($bindings as &$binding) {
            if (($binding['mode'] ?? 'def') !== 'static') {
                $binding['mode'] = 'static';
                $binding['value'] = 'sample-value';
            }
        }
        unset($binding);
        global $SITE;
        return self::preview($sample, $bindings, $SITE, (object)['id' => 0]);
    }

    /**
     * Decodes stored JSON parameter bindings safely.
     *
     * @param string|null $json JSON string from smarturl.parameters_json.
     * @return array<int, array<string, mixed>>
     */
    public static function decode_bindings(?string $json): array {
        if ($json === null || trim($json) === '') {
            return [];
        }
        $decoded = json_decode($json, true);
        if (!is_array($decoded)) {
            return [];
        }
        $out = [];
        foreach ($decoded as $item) {
            if (!is_array($item) || empty($item['param'])) {
                continue;
            }
            $out[] = [
                'param' => (string)$item['param'],
                'mode' => (($item['mode'] ?? 'def') === 'static') ? 'static' : 'def',
                'var' => (string)($item['var'] ?? ''),
                'value' => (string)($item['value'] ?? ''),
            ];
        }
        return $out;
    }

    /**
     * Computes string values for every enabled parameter definition.
     *
     * @param array<int, \stdClass> $defs Enabled definitions.
     * @param \stdClass $course Course record.
     * @param \stdClass $user User record.
     * @param int $cmid Course module ID.
     * @return array<string, string> Map of lowercased shortname -> value.
     */
    private static function compute_values(array $defs, \stdClass $course, \stdClass $user, int $cmid): array {
        global $CFG;

        $profilefields = null;
        $coursecustom = null;
        $rolesstr = null;

        $out = [];
        foreach ($defs as $def) {
            $shortname = strtolower((string)$def->shortname);
            $sourcetype = strtoupper((string)$def->source_type);
            $sourcekey = (string)$def->source_key;

            switch ($sourcetype) {
                case 'STATIC':
                    $out[$shortname] = $sourcekey;
                    break;

                case 'USER_PROFILE_FIELD':
                    if ($profilefields === null) {
                        require_once($CFG->dirroot . '/user/profile/lib.php');
                        $profilefields = (array)profile_user_record($user->id, false);
                    }
                    $out[$shortname] = (string)($profilefields[$sourcekey] ?? '');
                    break;

                case 'COURSE_CUSTOM_FIELD':
                    if ($coursecustom === null) {
                        $coursecustom = self::load_course_custom_fields((int)$course->id);
                    }
                    $out[$shortname] = (string)($coursecustom[$sourcekey] ?? '');
                    break;

                case 'BUILTIN':
                default:
                    if ($sourcekey === 'user.roles') {
                        if ($rolesstr === null) {
                            $ctx = $cmid > 0
                                ? \context_module::instance($cmid, IGNORE_MISSING)
                                : null;
                            $ctx = $ctx ?: \context_course::instance((int)$course->id);
                            $roles = get_user_roles($ctx, (int)$user->id, true);
                            $names = array_map(static fn($r) => $r->shortname, $roles);
                            $rolesstr = implode(',', array_unique($names));
                        }
                        $out[$shortname] = $rolesstr;
                    } else {
                        $out[$shortname] = self::resolve_builtin($sourcekey, $course, $user, $cmid);
                    }
                    break;
            }
        }
        return $out;
    }

    /**
     * Resolves a built-in scalar token.
     *
     * @param string $key Token identifier.
     * @param \stdClass $course Course record.
     * @param \stdClass $user User record.
     * @param int $cmid Course module ID.
     * @return string
     */
    private static function resolve_builtin(string $key, \stdClass $course, \stdClass $user, int $cmid): string {
        global $CFG;

        return match ($key) {
            'course.id' => (string)($course->id ?? ''),
            'course.shortname' => (string)($course->shortname ?? ''),
            'course.idnumber' => (string)($course->idnumber ?? ''),
            'course.fullname' => (string)($course->fullname ?? ''),
            'user.id' => (string)($user->id ?? ''),
            'user.username' => (string)($user->username ?? ''),
            'user.email' => (string)($user->email ?? ''),
            'user.idnumber' => (string)($user->idnumber ?? ''),
            'user.firstname' => (string)($user->firstname ?? ''),
            'user.lastname' => (string)($user->lastname ?? ''),
            'user.lang' => (string)($user->lang ?? current_language()),
            'cm.id' => $cmid > 0 ? (string)$cmid : '',
            'site.url' => (string)($CFG->wwwroot ?? ''),
            default => '',
        };
    }

    /**
     * Loads Moodle course custom field values keyed by field shortname.
     *
     * @param int $courseid Course ID.
     * @return array<string, string>
     */
    private static function load_course_custom_fields(int $courseid): array {
        if ($courseid <= 0 || !class_exists(\core_customfield\handler::class)) {
            return [];
        }
        $handler = \core_customfield\handler::get_handler('core_course', 'course');
        $data = $handler->get_instance_data($courseid, true);
        $out = [];
        foreach ($data as $item) {
            $field = $item->get_field();
            $out[$field->get('shortname')] = (string)$item->get_value();
        }
        return $out;
    }
}
