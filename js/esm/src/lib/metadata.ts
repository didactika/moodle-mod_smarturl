/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Pure helpers for high-volume metadata filtering, grouping, and formatting.
 *
 * @module     mod_smarturl/lib/metadata
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import type {MetadataEntry} from '../types';

export interface GroupFacet {
    name: string;
    count: number;
}

/**
 * Formats seconds cleanly into mm:ss or hh:mm:ss.
 */
export const formatDuration = (raw: string | number | null): string => {
    const secs = Number(raw);
    if (!Number.isFinite(secs) || secs <= 0) {
        return String(raw ?? '');
    }
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const rem = Math.floor(secs % 60);
    if (hrs > 0) {
        return `${hrs}:${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
    }
    return `${mins}:${String(rem).padStart(2, '0')}`;
};

/**
 * Filters metadata items by search query without mutating group counts.
 */
export const filterByQuery = (entries: MetadataEntry[], query: string): MetadataEntry[] => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
        return entries;
    }
    return entries.filter((entry) => {
        if (!entry.searchable) {
            return false;
        }
        return (
            entry.label.toLowerCase().includes(needle)
            || entry.key.toLowerCase().includes(needle)
            || entry.value.toLowerCase().includes(needle)
            || entry.group.toLowerCase().includes(needle)
        );
    });
};

/**
 * Computes live facet counts per group from the current search subset.
 */
export const computeGroupFacets = (entries: MetadataEntry[]): GroupFacet[] => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
        counts.set(entry.group, (counts.get(entry.group) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({name, count}));
};

/**
 * Groups filtered entries by group name preserving order.
 */
export const groupEntries = (entries: MetadataEntry[]): Array<[string, MetadataEntry[]]> => {
    const map = new Map<string, MetadataEntry[]>();
    for (const entry of entries) {
        const list = map.get(entry.group) ?? [];
        list.push(entry);
        map.set(entry.group, list);
    }
    return Array.from(map.entries());
};

/**
 * Splits a tag value list cleanly.
 */
export const splitTags = (value: string): string[] => value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
