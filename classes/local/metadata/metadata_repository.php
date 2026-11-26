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
 * Reads and writes normalized metadata values cleanly at high volume.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class metadata_repository {
    /**
     * Replaces all metadata entries of one Smart URL instance atomically.
     *
     * @param int $smarturlid Activity instance ID.
     * @param array<int, array{key: string, value: string}> $entries Key/value metadata entries.
     */
    public static function replace_for_instance(int $smarturlid, array $entries): void {
        global $DB;

        $typesbykey = [];
        foreach ($DB->get_records('smarturl_meta_type') as $type) {
            $typesbykey[strtolower($type->shortname)] = $type;
        }

        $now = time();
        $rows = [];
        $order = 1;
        foreach ($entries as $entry) {
            $rawkey = trim((string)($entry['key'] ?? ''));
            $value = (string)($entry['value'] ?? '');
            if ($rawkey === '' || $value === '') {
                continue;
            }
            $normkey = strtolower($rawkey);
            $type = $typesbykey[$normkey] ?? null;

            $rows[] = (object)[
                'smarturlid' => $smarturlid,
                'typeid' => $type ? (int)$type->id : null,
                'custom_key' => $type ? null : substr($rawkey, 0, 128),
                'value_text' => $value,
                'sortorder' => $order++,
                'timemodified' => $now,
            ];
        }

        $transaction = $DB->start_delegated_transaction();
        $DB->delete_records('smarturl_meta_value', ['smarturlid' => $smarturlid]);
        if (!empty($rows)) {
            $DB->insert_records('smarturl_meta_value', $rows);
        }
        $transaction->allow_commit();
    }

    /**
     * Reads normalized metadata for one Smart URL instance.
     *
     * @param int $smarturlid Instance ID.
     * @param bool $includehidden Include types marked HIDDEN.
     * @return array<int, array<string, mixed>>
     */
    public static function for_instance(int $smarturlid, bool $includehidden = false): array {
        $batch = self::for_instances([$smarturlid], $includehidden);
        return $batch[$smarturlid] ?? [];
    }

    /**
     * Batch loads normalized metadata for multiple Smart URL instances without N+1 queries.
     *
     * @param int[] $smarturlids Instance IDs.
     * @param bool $includehidden Include types marked HIDDEN.
     * @return array<int, array<int, array<string, mixed>>>
     */
    public static function for_instances(array $smarturlids, bool $includehidden = false): array {
        global $DB;

        $ids = array_values(array_unique(array_filter(array_map('intval', $smarturlids), static fn($id) => $id > 0)));
        if (empty($ids)) {
            return [];
        }

        [$insql, $params] = $DB->get_in_or_equal($ids, SQL_PARAMS_NAMED);
        $sql = "SELECT v.id, v.smarturlid, v.typeid, v.custom_key, v.value_text, v.sortorder,
                       t.shortname, t.name AS typename, t.group_name, t.datatype, t.icon,
                       t.display_priority, t.searchable, t.filterable, t.enabled
                  FROM {smarturl_meta_value} v
             LEFT JOIN {smarturl_meta_type} t ON t.id = v.typeid
                 WHERE v.smarturlid $insql
              ORDER BY v.smarturlid ASC, COALESCE(t.sortorder, 99999) ASC, v.sortorder ASC, v.id ASC";

        $grouped = [];
        foreach ($ids as $id) {
            $grouped[$id] = [];
        }

        foreach ($DB->get_records_sql($sql, $params) as $row) {
            if ($row->typeid !== null && empty($row->enabled)) {
                continue;
            }
            $priority = $row->typeid !== null ? (string)$row->display_priority : 'SECONDARY';
            if (!$includehidden && $priority === 'HIDDEN') {
                continue;
            }
            $key = $row->typeid !== null ? (string)$row->shortname : (string)$row->custom_key;
            $grouped[(int)$row->smarturlid][] = [
                'id' => (int)$row->id,
                'key' => $key,
                'label' => $row->typeid !== null ? (string)$row->typename : self::humanize_key($key),
                'group' => $row->typeid !== null ? (string)$row->group_name : 'Custom',
                'datatype' => $row->typeid !== null ? (string)$row->datatype : 'TEXT',
                'priority' => $priority,
                'icon' => $row->icon ?: null,
                'searchable' => $row->typeid !== null ? (bool)$row->searchable : true,
                'filterable' => $row->typeid !== null ? (bool)$row->filterable : true,
                'value' => (string)$row->value_text,
            ];
        }

        return $grouped;
    }

    /**
     * Converts a snake/kebab key into a readable label when no metadata type exists.
     *
     * @param string $key Custom metadata key.
     * @return string
     */
    private static function humanize_key(string $key): string {
        return ucfirst(trim(str_replace(['_', '-', '.'], ' ', $key)));
    }
}
