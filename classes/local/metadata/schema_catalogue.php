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

/**
 * Provides the catalogue table data and translated choices.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class schema_catalogue {
    /** @var array Table names indexed by section. */
    public const TABLES = [
        'categories' => 'smarturl_meta_category',
        'fields' => 'smarturl_meta_type',
        'variables' => 'smarturl_param_def',
    ];
    /** @var array Catalogue sections. */
    public const SECTIONS = ['fields', 'categories', 'variables'];

    /**
     * Returns a catalogue record.
     *
     * @param string $section Catalogue section.
     * @param int $id Record identifier.
     * @return \stdClass
     */
    public static function record(string $section, int $id): \stdClass {
        global $DB;
        return $section === 'categories'
            ? (category_manager::all()[$id] ?? $DB->get_record(self::TABLES[$section], ['id' => $id], '*', MUST_EXIST))
            : $DB->get_record(self::TABLES[$section], ['id' => $id], '*', MUST_EXIST);
    }

    /**
     * Returns data type choices.
     *
     * @return array
     */
    public static function datatypes(): array {
        $labels = [];
        foreach (array_merge(metadata_type_manager::DATATYPES, array_keys(field_types::extensions())) as $type) {
            $key = 'datatype_' . strtolower($type);
            $labels[$type] = get_string_manager()->string_exists($key, 'smarturl') ? get_string($key, 'smarturl') : $type;
        }
        return $labels;
    }

    /**
     * Returns visibility choices.
     *
     * @return array
     */
    public static function priorities(): array {
        return self::labels(metadata_type_manager::PRIORITIES, 'visibility_');
    }

    /**
     * Returns URL variable sources.
     *
     * @return array
     */
    public static function sources(): array {
        return self::labels(param_def_manager::SOURCE_TYPES, 'source_');
    }

    /**
     * Translates a list of identifiers.
     *
     * @param array $keys Identifiers.
     * @param string $prefix String prefix.
     * @return array
     */
    private static function labels(array $keys, string $prefix): array {
        return array_combine($keys, array_map(
            static fn($key) => get_string($prefix . strtolower($key), 'smarturl'),
            $keys,
        ));
    }

    /**
     * Returns rows in the format shared by the Moodle frontend lines.
     *
     * @return array
     */
    public static function rows(): array {
        $types = self::datatypes();
        $priorities = self::priorities();
        $sources = self::sources();
        return [
            'fields' => array_map(static fn($row) => [
                'id' => (int)$row->id,
                'name' => $row->name,
                'detail' => $row->shortname,
                'columns' => [
                    $row->group_name,
                    $types[$row->datatype] ?? $row->datatype,
                    $priorities[$row->display_priority] ?? $row->display_priority,
                ],
                'enabled' => (bool)$row->enabled,
            ], metadata_type_manager::list_all()),
            'categories' => array_map(static fn($row) => [
                'id' => (int)$row->id,
                'name' => $row->name,
                'detail' => '',
                'columns' => [(string)$row->fields],
                'enabled' => (bool)$row->enabled,
            ], array_values(category_manager::all())),
            'variables' => array_map(static fn($row) => [
                'id' => (int)$row->id,
                'name' => $row->name,
                'detail' => $row->shortname,
                'columns' => [$sources[$row->source_type] ?? $row->source_type, $row->default_query_param ?: '–'],
                'enabled' => (bool)$row->enabled,
            ], param_def_manager::list_all()),
        ];
    }

    /**
     * Returns labels and initial rows used by the site-wide catalogue.
     *
     * @param string $tab Current section.
     * @return array
     */
    public static function props(string $tab): array {
        $sections = [];
        foreach (
            [
            'fields' => ['metadatatypes', 'newfield', ['category', 'datatype', 'priority']],
            'categories' => ['categories', 'createcategory', ['metadatatypes']],
            'variables' => ['paramdefs', 'newvariable', ['sourcetype', 'defaultqueryparam']],
            ] as $key => [$title, $add, $columns]
        ) {
            $sections[] = [
                'key' => $key,
                'title' => get_string($title, 'smarturl'),
                'add' => get_string($add, 'smarturl'),
                'columns' => array_map(static fn($column) => get_string($column, 'smarturl'), $columns),
            ];
        }
        $strings = [];
        foreach (
            ['name', 'description', 'search', 'status', 'actions', 'edit', 'delete', 'show', 'hide',
            'previous', 'next', 'all', 'settings', 'savechanges', 'filters'] as $name
        ) {
            $strings[$name] = get_string($name);
        }
        foreach (
            ['enabled', 'disabled', 'adminconfigsubtitle', 'clearfilters', 'emptyresults', 'pagerlabel',
            'pagerange', 'listempty', 'confirmdelete', 'deletecategoryheading'] as $name
        ) {
            $strings[$name] = get_string($name, 'smarturl');
        }
        return [
            'sections' => $sections,
            'rows' => self::rows(),
            'tab' => in_array($tab, self::SECTIONS, true) ? $tab : 'fields',
            'settingsUrl' => (new \moodle_url('/admin/settings.php', ['section' => 'modsettingsmarturl']))->out(false),
            'adminUrl' => (new \moodle_url('/mod/smarturl/admin.php'))->out(false),
            'strings' => $strings,
        ];
    }
}
