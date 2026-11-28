/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The header of the catalogue, with what the page manages and its actions, and a tab for each section with its count.
 *
 * @module     mod_smarturl/components/admin/CatalogueHeader
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import type {MouseEvent} from 'react';
import Pix from '../common/Pix';
import type {CatalogueRows, CatalogueSection, SectionKey} from '../../lib/catalogue';

interface Props {
    sections: CatalogueSection[];
    current: CatalogueSection;
    rows: CatalogueRows;
    adminUrl: string;
    settingsUrl: string;
    icons: Record<string, string>;
    strings: Record<string, string>;
    onSection: (key: SectionKey) => void;
    onAdd: (opener: HTMLElement) => void;
}

/**
 * Draws the header and the tabs.
 *
 * @param props The sections, the one on show, the rows of each, the addresses, the icons, the texts and the changes.
 * @returns The header and the tabs.
 */
const CatalogueHeader = ({sections, current, rows, adminUrl, settingsUrl, icons, strings: t, onSection, onAdd}: Props) => {
    const choose = (key: SectionKey) => (event: MouseEvent<HTMLAnchorElement>) => {
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            onSection(key);
        }
    };

    return <>
        <header className="d-grid gap-3 pb-3 border-bottom" data-region="page-header">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                    <span className="icon-box"><Pix html={icons.monologo}/></span>
                    <p className="text-body-secondary mb-0">{t.adminconfigsubtitle}</p>
                </div>
                <div className="d-flex flex-wrap align-items-center gap-2" data-region="actions">
                    <a className="btn btn-outline-secondary" href={settingsUrl}><Pix html={icons['i/settings']}/> {t.settings}</a>
                    <button type="button" className="btn btn-primary" data-action="add"
                        onClick={event => onAdd(event.currentTarget)}>
                        <Pix html={icons['t/add']}/> {current.add}
                    </button>
                </div>
            </div>
        </header>
        <ul className="nav nav-tabs" aria-label={t.settings}>
            {sections.map(section => <li key={section.key} className="nav-item">
                <a className={'nav-link' + (section.key === current.key ? ' active' : '')} href={adminUrl + '?tab=' + section.key}
                    data-tab={section.key} aria-current={section.key === current.key ? 'page' : undefined}
                    onClick={choose(section.key)}>
                    <span>{section.title}</span>
                    {' '}<span className="badge rounded-pill text-bg-secondary">{rows[section.key].length}</span>
                </a>
            </li>)}
        </ul>
    </>;
};

export default CatalogueHeader;
