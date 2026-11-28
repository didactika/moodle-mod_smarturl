/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The pager of the catalogue: the page size, the rows on show and the previous and next pages.
 *
 * @module     mod_smarturl/components/admin/CataloguePager
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useId} from 'react';
import Pix from '../common/Pix';

interface Props {
    sizes: number[];
    size: number;
    range: string;
    first: boolean;
    last: boolean;
    icons: Record<string, string>;
    strings: Record<string, string>;
    onSize: (size: number) => void;
    onPage: (step: -1 | 1) => void;
}

/**
 * Draws the pager.
 *
 * @param props The sizes offered and chosen, the rows on show, whether the page is the first or the last, the icons and texts.
 * @returns The pager.
 */
const CataloguePager = ({sizes, size, range, first, last, icons, strings: t, onSize, onPage}: Props) => {
    const id = useId();

    return <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 small text-body-secondary">
        <div className="d-none d-sm-flex align-items-center gap-2">
            <label htmlFor={id} className="mb-0">{t.pagerlabel}</label>
            <select className="form-select form-select-sm" id={id} data-region="perpage" value={size}
                onChange={event => onSize(Number(event.target.value))}>
                {sizes.map(option => <option key={option} value={option}>{option || t.all}</option>)}
            </select>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3 ms-auto">
            <span className="text-body text-nowrap" role="status" data-region="range">{range}</span>
            <div className="d-flex gap-1">
                <button type="button" className="btn btn-outline-secondary btn-sm btn-icon" data-action="prev" disabled={first}
                    title={t.previous} aria-label={t.previous} onClick={() => onPage(-1)}><Pix html={icons['i/previous']}/></button>
                <button type="button" className="btn btn-outline-secondary btn-sm btn-icon" data-action="next" disabled={last}
                    title={t.next} aria-label={t.next} onClick={() => onPage(1)}><Pix html={icons['i/next']}/></button>
            </div>
        </div>
    </div>;
};

export default CataloguePager;
