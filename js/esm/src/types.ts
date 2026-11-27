/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Shared TypeScript types for mod_smarturl frontend modules.
 *
 * @module     mod_smarturl/types
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export type MetaDatatype = 'TEXT' | 'BADGE' | 'TAGS' | 'URL' | 'DATE' | 'NUMBER' | 'DURATION' | 'BOOLEAN' | 'MULTILINE';
export type DisplayPriority = 'PRIMARY' | 'SECONDARY' | 'HIDDEN';

export interface MetadataEntry {
    id: number;
    key: string;
    label: string;
    group: string;
    datatype: MetaDatatype | string;
    priority: DisplayPriority | string;
    icon?: string | null;
    searchable: boolean;
    filterable: boolean;
    value: string;
}

export interface PolicySummary {
    managedBy: string | null;
    lockedFields: string[];
}

export interface ResourceViewProps {
    cmid: number;
    courseid: number;
    courseurl: string;
    coursename: string;
    name: string;
    intro: string;
    playable: boolean;
    playerHtml: string;
    goUrl: string;
    displayMode: string;
    popupWidth: number;
    popupHeight: number;
    aspectRatio: string;
    thumbnailUrl: string | null;
    durationSeconds: number | null;
    policy: PolicySummary;
    metadata: MetadataEntry[];
    strings: Record<string, string>;
}
