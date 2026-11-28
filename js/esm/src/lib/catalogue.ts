/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * What the site catalogue shows: the rows a search and a status leave, the counts of the status chips, the page sizes and the
 * page on show. Pure functions, so the screen only draws what they return.
 *
 * @module     mod_smarturl/lib/catalogue
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export type SectionKey = 'categories' | 'fields' | 'variables';
export type Status = '' | 'active' | 'inactive';

export interface CatalogueRow {
    id: number;
    name: string;
    detail: string;
    columns: string[];
    enabled: boolean;
}

export type CatalogueRows = Record<SectionKey, CatalogueRow[]>;

export interface CatalogueSection {
    key: SectionKey;
    title: string;
    add: string;
    columns: string[];
    icon: string;
    emptytitle: string;
    emptytext: string;
}

/** The sizes a page can have; 0 shows every row. */
export const PAGE_SIZES = [12, 24, 48, 96];

/** Above this many rows the list never shows them all at once. */
const ALL_LIMIT = 500;

/**
 * The rows of a section a search leaves.
 *
 * @param rows The rows of the section.
 * @param query What was searched.
 * @returns The rows whose name, detail or any column contains it.
 */
export const searched = (rows: CatalogueRow[], query: string): CatalogueRow[] => {
    const needle = query.trim().toLocaleLowerCase();
    return rows.filter(row => [row.name, row.detail, ...row.columns]
        .some(value => String(value).toLocaleLowerCase().includes(needle)));
};

/**
 * Whether a row has a status.
 *
 * @param row The row.
 * @param status The status, empty for any.
 * @returns True when it has it.
 */
export const hasStatus = (row: CatalogueRow, status: Status): boolean => !status || row.enabled === (status === 'active');

/**
 * The page sizes a list of rows offers: those smaller than the list, and every row at once when the list is not too long.
 *
 * @param count How many rows there are.
 * @returns The sizes, 0 for every row.
 */
export const pageSizes = (count: number): number[] => {
    const sizes = PAGE_SIZES.filter(size => size < count);
    if (count <= ALL_LIMIT) {
        sizes.push(0);
    }
    return sizes;
};

/**
 * The page on show: its size, the first row, how many rows it holds and whether there are pages before and after it.
 *
 * @param count How many rows there are.
 * @param wanted The size the person chose.
 * @param page The page asked for, from 0.
 * @returns The page.
 */
export const pageOf = (count: number, wanted: number, page: number) => {
    const sizes = pageSizes(count);
    const size = sizes.includes(wanted) ? wanted : sizes[sizes.length - 1];
    const span = size || Math.max(1, count);
    const current = Math.min(page, Math.max(0, Math.ceil(count / span) - 1));
    const offset = current * span;
    return {sizes, size, span, current, offset, first: offset === 0, last: offset + span >= count};
};
