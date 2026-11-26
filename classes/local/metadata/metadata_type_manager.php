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
 * Manages configurable metadata type schemas.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class metadata_type_manager {
    /** @var string[] Supported value rendering datatypes. */
    public const DATATYPES = ['TEXT', 'BADGE', 'TAGS', 'URL', 'DATE', 'NUMBER', 'DURATION', 'BOOLEAN', 'MULTILINE'];

    /** @var string[] Supported visibility priorities. */
    public const PRIORITIES = ['PRIMARY', 'SECONDARY', 'HIDDEN'];

    /**
     * Lists configured metadata types sorted by group and sortorder.
     *
     * @param bool $enabledonly Whether to restrict to enabled types.
     * @return \stdClass[]
     */
    public static function list_all(bool $enabledonly = false): array {
        global $DB;

        $fields = array_values($DB->get_records('smarturl_meta_type', [], 'sortorder ASC, id ASC'));
        if (!$enabledonly) {
            return $fields;
        }
        $categories = $DB->get_records('smarturl_meta_category');
        return array_values(array_filter($fields, static fn($field) => $field->enabled
            && ($field->categoryid === null || !empty($categories[$field->categoryid]->enabled))));
    }

    /**
     * Creates or updates a metadata type definition.
     *
     * @param array<string, mixed> $data Input fields.
     * @return \stdClass Saved record.
     */
    public static function save(array $data): \stdClass {
        global $DB;

        $id = !empty($data['id']) ? (int)$data['id'] : 0;
        $shortname = clean_param(strtolower(trim((string)$data['shortname'])), PARAM_ALPHANUMEXT);
        if ($shortname === '') {
            throw new \invalid_parameter_exception('Metadata type shortname is required.');
        }

        $datatype = strtoupper((string)($data['datatype'] ?? 'TEXT'));
        if (!in_array($datatype, array_merge(self::DATATYPES, array_keys(field_types::extensions())), true)) {
            $datatype = 'TEXT';
        }

        $priority = strtoupper((string)($data['display_priority'] ?? 'SECONDARY'));
        if (!in_array($priority, self::PRIORITIES, true)) {
            $priority = 'SECONDARY';
        }

        $existing = $DB->get_record('smarturl_meta_type', ['shortname' => $shortname]);
        if ($existing && (int)$existing->id !== $id) {
            throw new \invalid_parameter_exception("Duplicate metadata type shortname '$shortname'.");
        }

        $category = !empty($data['categoryid'])
            ? $DB->get_record('smarturl_meta_category', ['id' => (int)$data['categoryid']], '*', MUST_EXIST)
            : category_manager::for_name((string)($data['group_name'] ?? 'General'));
        $now = time();
        $record = (object)[
            'shortname' => $shortname,
            'name' => trim((string)($data['name'] ?? $shortname)),
            'description' => isset($data['description']) ? trim((string)$data['description']) : null,
            'group_name' => $category->name,
            'categoryid' => $category->id,
            'datatype' => $datatype,
            'icon' => !empty($data['icon']) ? trim((string)$data['icon']) : null,
            'display_priority' => $priority,
            'searchable' => isset($data['searchable']) ? (int)!empty($data['searchable']) : 1,
            'filterable' => isset($data['filterable']) ? (int)!empty($data['filterable']) : 1,
            'enabled' => isset($data['enabled']) ? (int)!empty($data['enabled']) : 1,
            'sortorder' => (int)($data['sortorder'] ?? 0),
            'timemodified' => $now,
        ];

        if ($id > 0) {
            $record->id = $id;
            $DB->update_record('smarturl_meta_type', $record);
        } else {
            $record->timecreated = $now;
            if ($record->sortorder <= 0) {
                $record->sortorder = (int)$DB->count_records('smarturl_meta_type') + 1;
            }
            $record->id = $DB->insert_record('smarturl_meta_type', $record);
        }

        return $DB->get_record('smarturl_meta_type', ['id' => $record->id], '*', MUST_EXIST);
    }

    /**
     * Deletes a metadata type; any attached values keep their custom_key text as fallback.
     *
     * @param int $id Metadata type ID.
     */
    public static function delete(int $id): void {
        global $DB;

        $type = $DB->get_record('smarturl_meta_type', ['id' => $id]);
        if (!$type) {
            return;
        }
        $transaction = $DB->start_delegated_transaction();
        $category = $type->categoryid ? $DB->get_record('smarturl_meta_category', ['id' => $type->categoryid]) : null;
        if (!$type->enabled || $type->display_priority === 'HIDDEN' || ($category && !$category->enabled)) {
            $DB->set_field('smarturl_meta_value', 'archived', 1, ['typeid' => $id]);
        }
        $DB->set_field_select(
            'smarturl_meta_value',
            'custom_key',
            $type->shortname,
            'typeid = :typeid AND custom_key IS NULL',
            ['typeid' => $id],
        );
        $DB->set_field('smarturl_meta_value', 'typeid', null, ['typeid' => $id]);
        $DB->delete_records('smarturl_meta_type', ['id' => $id]);
        $transaction->allow_commit();
    }
}
