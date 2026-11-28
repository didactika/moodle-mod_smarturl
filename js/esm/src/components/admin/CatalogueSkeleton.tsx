/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The columns and the header of a section with rows of placeholders, drawn while its rows are on their way, so a new section
 * never shows the rows of the one before and a filter never shows rows it does not match.
 *
 * @module     mod_smarturl/components/admin/CatalogueSkeleton
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {Columns} from './CatalogueTable';
import type {CatalogueSection} from '../../lib/catalogue';

/** How many rows of placeholders are drawn. */
const ROWS = 8;

/**
 * Draws the placeholders of a section.
 *
 * @param props The section, whether its rows have a detail line and the texts.
 * @returns The table of placeholders.
 */
const CatalogueSkeleton = ({section, detailed, strings: t}: {
    section: CatalogueSection;
    detailed: boolean;
    strings: Record<string, string>;
}) => {
    const widths = [['w-75', detailed ? 'w-50' : ''], ...section.columns.map(() => ['w-75']), ['w-50']];

    return <table className="table w-100">
        <caption className="visually-hidden">{section.title}</caption>
        <Columns section={section}/>
        <thead>
            <tr>
                {[t.name, ...section.columns, t.status].map(title => <th scope="col" key={title}>{title}</th>)}
                <th scope="col" className="text-end" data-column="actions"/>
            </tr>
        </thead>
        <tbody>
            {Array.from({length: ROWS}, (_, row) => <tr key={row} aria-hidden="true">
                {widths.map((cell, index) => <td key={index}>
                    {cell.filter(Boolean).map(width => <span key={width} className={'placeholder ' + width}/>)}
                </td>)}
                <td className="text-end" data-column="actions"><span className="placeholder"/><span className="placeholder"/></td>
            </tr>)}
        </tbody>
    </table>;
};

export default CatalogueSkeleton;
