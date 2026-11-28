/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The toolbar of the catalogue: the search, the status chips with what each leaves, and the button that clears them.
 *
 * @module     mod_smarturl/components/admin/CatalogueFilters
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useId} from 'react';
import Pix from '../common/Pix';
import type {Status} from '../../lib/catalogue';

interface Props {
    search: string;
    status: Status;
    counts: Record<Status, number>;
    narrowed: boolean;
    icons: Record<string, string>;
    strings: Record<string, string>;
    onSearch: (text: string) => void;
    onStatus: (status: Status) => void;
    onClear: () => void;
}

/**
 * Draws the toolbar.
 *
 * @param props What is searched and filtered, what each chip leaves, the icons, the texts and the changes.
 * @returns The toolbar.
 */
const CatalogueFilters = ({search, status, counts, narrowed, icons, strings: t, onSearch, onStatus, onClear}: Props) => {
    const id = useId();
    const chips: [Status, string][] = [['', t.all], ['active', t.enabled], ['inactive', t.disabled]];

    return <div className="d-flex align-items-center justify-content-between gap-3" data-region="filters">
        <div className="d-flex align-items-center gap-2 flex-grow-1">
            <div className="position-relative d-flex align-items-center" role="search" aria-label={t.search}>
                <Pix html={icons['a/search']}/>
                <label className="visually-hidden" htmlFor={id}>{t.search}</label>
                <input className="form-control" type="search" id={id} data-region="search" placeholder={t.search}
                    autoComplete="off" value={search} onChange={event => onSearch(event.target.value)}
                    onKeyDown={event => event.key === 'Enter' && event.preventDefault()}/>
                {search && <button type="button" className="btn btn-link btn-icon btn-sm" data-action="clear-search"
                    title={t.clear} aria-label={t.clear} onClick={() => onSearch('')}><Pix html={icons['e/cancel']}/></button>}
            </div>
        </div>
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <div className="d-flex align-items-center gap-2" role="group" aria-label={t.status} data-region="chips">
                {chips.map(([value, label]) => <button key={value} type="button" data-status={value}
                    className={'btn btn-sm btn-outline-secondary rounded-pill' + (status === value ? ' active' : '')}
                    aria-pressed={status === value} onClick={() => onStatus(value)}>
                    {label} <span className="badge rounded-pill text-bg-primary">{counts[value]}</span>
                </button>)}
            </div>
            <button type="button" className="btn btn-link btn-icon" data-action="clearfilters" disabled={!narrowed}
                title={t.clearfilters} aria-label={t.clearfilters} onClick={onClear}><Pix html={icons['i/reload']}/></button>
        </div>
    </div>;
};

export default CatalogueFilters;
