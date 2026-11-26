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
 * Seeds default dynamic URL parameter definitions and generic metadata types on installation.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class installer {
    /**
     * Inserts built-in dynamic URL parameters and generic metadata types if missing.
     */
    public static function seed_defaults(): void {
        global $DB;

        $now = time();
        $params = [
            ['course_id', 'Course ID', 'Numeric Moodle ID of the current course.', 'BUILTIN', 'course.id', 'courseid'],
            ['course_shortname', 'Course shortname', 'Short name of the current course.', 'BUILTIN', 'course.shortname', 'course'],
            ['course_idnumber', 'Course ID number', 'External ID number of the current course.', 'BUILTIN', 'course.idnumber', 'course_code'],
            ['user_id', 'User ID', 'Numeric Moodle ID of the current user.', 'BUILTIN', 'user.id', 'userid'],
            ['user_username', 'Username', 'Login username of the current user.', 'BUILTIN', 'user.username', 'username'],
            ['user_email', 'User email', 'Email address of the current user.', 'BUILTIN', 'user.email', 'email'],
            ['user_idnumber', 'User ID number', 'External ID number of the current user.', 'BUILTIN', 'user.idnumber', 'user_idnumber'],
            ['user_lang', 'User language', 'Preferred UI language code of the current user.', 'BUILTIN', 'user.lang', 'lang'],
            ['user_roles', 'User course roles', 'Comma-separated role shortnames held by the user in this context.', 'BUILTIN', 'user.roles', 'roles'],
            ['cm_id', 'Course module ID', 'Numeric course module ID of this activity.', 'BUILTIN', 'cm.id', 'cmid'],
            ['site_url', 'Site URL', 'Base URL of this Moodle site.', 'BUILTIN', 'site.url', 'campus'],
        ];

        foreach ($params as $index => [$shortname, $name, $desc, $sourcetype, $sourcekey, $defaultparam]) {
            if ($DB->record_exists('smarturl_param_def', ['shortname' => $shortname])) {
                continue;
            }
            $DB->insert_record('smarturl_param_def', (object)[
                'shortname' => $shortname,
                'name' => $name,
                'description' => $desc,
                'source_type' => $sourcetype,
                'source_key' => $sourcekey,
                'default_query_param' => $defaultparam,
                'enabled' => 1,
                'sortorder' => $index + 1,
                'timecreated' => $now,
                'timemodified' => $now,
            ]);
        }

        $metatypes = [
            ['category', 'Category', 'Resource category or classification.', 'General', 'BADGE', 'PRIMARY', 1, 1],
            ['source', 'Source', 'Origin repository or provider system.', 'General', 'BADGE', 'PRIMARY', 1, 1],
            ['resource_type', 'Resource type', 'Kind of content (video, book, recording, article).', 'General', 'BADGE', 'PRIMARY', 1, 1],
            ['language', 'Language', 'Primary language code(s) of the resource.', 'Academic', 'TAGS', 'PRIMARY', 1, 1],
            ['area', 'Knowledge area', 'Academic discipline or thematic area.', 'Academic', 'TAGS', 'PRIMARY', 1, 1],
            ['requirement', 'Requirement', 'Pedagogical status (mandatory, recommended, optional).', 'Academic', 'BADGE', 'PRIMARY', 1, 1],
            ['authors', 'Authors', 'Creators, speakers or authors.', 'Bibliographic', 'TAGS', 'SECONDARY', 1, 0],
            ['publisher', 'Publisher', 'Publishing institution or editorial.', 'Bibliographic', 'TEXT', 'SECONDARY', 1, 1],
            ['year', 'Publication year', 'Year of publication or recording.', 'Bibliographic', 'NUMBER', 'SECONDARY', 1, 1],
            ['license', 'License', 'Rights or licensing terms.', 'Bibliographic', 'TEXT', 'SECONDARY', 1, 1],
            ['duration', 'Duration', 'Playback duration in seconds or formatted text.', 'Technical', 'DURATION', 'SECONDARY', 0, 0],
            ['external_id', 'External ID', 'Upstream identifier in the source system.', 'Technical', 'TEXT', 'SECONDARY', 1, 0],
            ['canonical_url', 'Canonical URL', 'Reference permalink in the origin catalog.', 'Technical', 'URL', 'SECONDARY', 1, 0],
            ['tags', 'Tags', 'Free classification keywords.', 'General', 'TAGS', 'SECONDARY', 1, 1],
        ];

        foreach ($metatypes as $index => [$shortname, $name, $desc, $group, $datatype, $priority, $searchable, $filterable]) {
            if ($DB->record_exists('smarturl_meta_type', ['shortname' => $shortname])) {
                continue;
            }
            $DB->insert_record('smarturl_meta_type', (object)[
                'shortname' => $shortname,
                'name' => $name,
                'description' => $desc,
                'group_name' => $group,
                'datatype' => $datatype,
                'icon' => null,
                'display_priority' => $priority,
                'searchable' => $searchable,
                'filterable' => $filterable,
                'enabled' => 1,
                'sortorder' => $index + 1,
                'timecreated' => $now,
                'timemodified' => $now,
            ]);
        }
    }
}
