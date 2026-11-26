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

        $types = $DB->get_records('smarturl_meta_type');
        $values = $DB->get_records_list('smarturl_meta_value', 'smarturlid', $ids, 'smarturlid ASC, sortorder ASC, id ASC');

        $grouped = [];
        foreach ($ids as $id) {
            $grouped[$id] = [];
        }

        $temp = [];
        foreach ($values as $v) {
            $type = $v->typeid !== null ? ($types[(int)$v->typeid] ?? null) : null;
            if ($v->typeid !== null && (!$type || empty($type->enabled))) {
                continue;
            }
            $priority = $type ? (string)$type->display_priority : 'SECONDARY';
            if (!$includehidden && $priority === 'HIDDEN') {
                continue;
            }
            $key = $type ? (string)$type->shortname : (string)$v->custom_key;
            $temp[(int)$v->smarturlid][] = [
                'order' => $type ? (int)$type->sortorder : 99999,
                'roworder' => (int)$v->sortorder,
                'rowid' => (int)$v->id,
                'entry' => [
                    'id' => (int)$v->id,
                    'key' => $key,
                    'label' => $type ? (string)$type->name : self::humanize_key($key),
                    'group' => $type ? (string)$type->group_name : 'Custom',
                    'datatype' => $type ? (string)$type->datatype : 'TEXT',
                    'priority' => $priority,
                    'icon' => ($type && !empty($type->icon)) ? $type->icon : null,
                    'searchable' => $type ? (bool)$type->searchable : true,
                    'filterable' => $type ? (bool)$type->filterable : true,
                    'value' => (string)$v->value_text,
                ],
            ];
        }

        foreach ($temp as $sid => $entries) {
            usort($entries, static fn($a, $b) => ($a['order'] <=> $b['order'])
                ?: ($a['roworder'] <=> $b['roworder'])
                ?: ($a['rowid'] <=> $b['rowid']));
            $grouped[$sid] = array_map(static fn($e) => $e['entry'], $entries);
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
