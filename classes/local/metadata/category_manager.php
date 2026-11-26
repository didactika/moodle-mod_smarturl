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
 * Maintains named categories without coupling their identity to a display name.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class category_manager {
    /**
     * Lists categories with their usage in field definitions.
     *
     * @return array
     */
    public static function all(): array {
        global $DB;
        $categories = $DB->get_records('smarturl_meta_category', [], 'sortorder ASC, name ASC');
        $counts = array_count_values($DB->get_fieldset_select('smarturl_meta_type', 'categoryid', 'categoryid IS NOT NULL'));
        foreach ($categories as $category) {
            $category->fields = $counts[$category->id] ?? 0;
        }
        return $categories;
    }

    /**
     * Assigns an identity to groups from the previous schema.
     */
    public static function backfill(): void {
        global $DB;
        $fields = $DB->get_records_select(
            'smarturl_meta_type',
            'categoryid IS NULL AND enabled = 1',
            [],
            'id ASC',
            'id, group_name',
        );
        foreach ($fields as $field) {
            $category = self::for_name($field->group_name);
            $DB->set_field('smarturl_meta_type', 'categoryid', $category->id, ['id' => $field->id]);
        }
    }

    /**
     * Resolves the group name used by existing API consumers.
     *
     * @param string $name Group name.
     * @return \stdClass
     */
    public static function for_name(string $name): \stdClass {
        global $DB;
        $name = trim($name) ?: 'General';
        return $DB->get_record('smarturl_meta_category', ['name' => $name]) ?: self::save(0, $name, true);
    }

    /**
     * Saves a category and keeps the legacy name available to existing clients.
     *
     * @param int $id Category ID, or zero.
     * @param string $name Display name.
     * @param bool $enabled Whether the category is available.
     * @param int|null $sortorder Display order.
     * @return \stdClass
     */
    public static function save(int $id, string $name, bool $enabled, ?int $sortorder = null): \stdClass {
        global $DB;
        $name = trim($name);
        if ($name === '' || \core_text::strlen($name) > 64) {
            throw new \invalid_parameter_exception('Enter a category name of up to 64 characters.');
        }
        $transaction = $DB->start_delegated_transaction();
        if ($id) {
            $record = $DB->get_record('smarturl_meta_category', ['id' => $id], '*', MUST_EXIST);
        } else {
            $record = (object)['sortorder' => $DB->count_records('smarturl_meta_category') + 1];
        }
        $record->name = $name;
        $record->enabled = (int)$enabled;
        $record->sortorder = $sortorder ?? $record->sortorder;
        if ($id) {
            $DB->update_record('smarturl_meta_category', $record);
            $DB->set_field('smarturl_meta_type', 'group_name', $name, ['categoryid' => $id]);
        } else {
            $record->id = $DB->insert_record('smarturl_meta_category', $record);
        }
        $transaction->allow_commit();
        return $record;
    }

    /**
     * Removes a category after moving or disabling all of its field definitions.
     *
     * @param int $id Category to remove.
     * @param int $destination Move fields to this category, or leave them disabled.
     */
    public static function delete(int $id, int $destination = 0): void {
        global $DB;
        if (!$id || $id === $destination) {
            throw new \invalid_parameter_exception('Choose a different destination category.');
        }
        $transaction = $DB->start_delegated_transaction();
        if ($destination) {
            $target = $DB->get_record('smarturl_meta_category', ['id' => $destination], '*', MUST_EXIST);
            $DB->set_field('smarturl_meta_type', 'group_name', $target->name, ['categoryid' => $id]);
        } else {
            $DB->set_field('smarturl_meta_type', 'enabled', 0, ['categoryid' => $id]);
        }
        $DB->set_field('smarturl_meta_type', 'categoryid', $destination ?: null, ['categoryid' => $id]);
        $DB->delete_records('smarturl_meta_category', ['id' => $id]);
        $transaction->allow_commit();
    }
}
