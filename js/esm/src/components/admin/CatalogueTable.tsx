/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The table of a catalogue section: its caption, its columns, the header and one row for each item on the page. The name of a
 * row opens it; the actions keep one slot each, in one order (edit, delete), so each action is always in the same column.
 *
 * @module     mod_smarturl/components/admin/CatalogueTable
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import type {MouseEvent} from 'react';
import Pix from '../common/Pix';
import type {CatalogueRow, CatalogueSection} from '../../lib/catalogue';

interface Props {
    section: CatalogueSection;
    rows: CatalogueRow[];
    icons: Record<string, string>;
    strings: Record<string, string>;
    onOpen: (opener: HTMLElement, row: CatalogueRow, remove: boolean) => void;
}

/**
 * The columns of a section, shared by its rows and its placeholders so nothing moves when the rows arrive.
 *
 * @param props The section.
 * @returns The column group.
 */
export const Columns = ({section}: {section: CatalogueSection}) => <colgroup>
    <col data-column="name"/>
    {section.columns.map(column => <col key={column}/>)}
    <col data-column="status"/>
    <col data-column="actions"/>
</colgroup>;

/**
 * Draws the rows of a section.
 *
 * @param props The section, its rows on the page, the icons, the texts and what opens an item.
 * @returns The table.
 */
const CatalogueTable = ({section, rows, icons, strings: t, onOpen}: Props) => {
    const open = (row: CatalogueRow, remove: boolean) => (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        onOpen(event.currentTarget, row, remove);
    };

    return <table className="table w-100">
        <caption className="visually-hidden">{section.title}</caption>
        <Columns section={section}/>
        <thead>
            <tr>
                <th scope="col" data-column="name">{t.name}</th>
                {section.columns.map(column => <th scope="col" key={column}>{column}</th>)}
                <th scope="col" data-column="status">{t.status}</th>
                <th scope="col" className="text-end text-nowrap" data-column="actions">
                    <span className="visually-hidden">{t.actions}</span>
                </th>
            </tr>
        </thead>
        <tbody>
            {rows.map(row => <tr key={row.id} data-id={row.id}>
                <th scope="row" data-column="name">
                    <span className="d-flex flex-column overflow-hidden">
                        <a className="fw-bold text-truncate" href={'#item-' + row.id} title={row.name} onClick={open(row, false)}>
                            {row.name}
                        </a>
                        {row.detail && <span className="small text-body-secondary text-truncate"><code>{row.detail}</code></span>}
                    </span>
                </th>
                {row.columns.map((cell, index) => <td key={index}>{cell}</td>)}
                <td data-column="status">
                    <span className={'badge rounded-pill ' + (row.enabled ? 'text-bg-success' : 'text-bg-secondary')}>
                        {row.enabled ? t.enabled : t.disabled}
                    </span>
                </td>
                <td className="text-end" data-column="actions">
                    <button type="button" className="btn btn-link btn-icon btn-sm text-primary" title={`${t.edit} ${row.name}`}
                        aria-label={`${t.edit} ${row.name}`} onClick={open(row, false)}><Pix html={icons['t/edit']}/></button>
                    <button type="button" className="btn btn-link btn-icon btn-sm text-danger" title={`${t.delete} ${row.name}`}
                        aria-label={`${t.delete} ${row.name}`} onClick={open(row, true)}><Pix html={icons['t/delete']}/></button>
                </td>
            </tr>)}
        </tbody>
    </table>;
};

export default CatalogueTable;
