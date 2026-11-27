/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/AdminConfig
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useRef, useState} from 'react';
import {installSelectMenus} from './lib/selectMenus';
import {openSchemaModal} from './lib/schemaModal';
import {useDebouncedValue} from './hooks/useDebouncedValue';

type Tab = 'fields' | 'categories' | 'variables';
type Row = {id: number; name: string; detail: string; columns: string[]; enabled: boolean};
type Rows = Record<Tab, Row[]>;
interface Props {
    sections: {key: Tab; title: string; add: string; columns: string[]}[];
    tab: Tab;
    rows: Rows;
    settingsUrl: string;
    previousIcon: string;
    nextIcon: string;
    clearIcon: string;
    adminUrl: string;
    strings: Record<string, string>;
}

const Icon = ({name}: {name: string}) => <i className={'fa fa-' + name} aria-hidden="true"/>;

const AdminConfig = (props: Props) => {
    const {strings: t} = props;
    const [tab, setTab] = useState(props.tab);
    const [rows, setRows] = useState(props.rows);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [perPage, setPerPage] = useState(12);
    const [page, setPage] = useState(0);
    const [failure, setFailure] = useState('');
    const root = useRef<HTMLDivElement>(null);
    const queryApplied = useDebouncedValue(query.trim().toLocaleLowerCase(), 400);
    const section = props.sections.find(candidate => candidate.key === tab) ?? props.sections[0];

    useEffect(() => root.current ? installSelectMenus(root.current) : undefined, []);

    const open = (opener: HTMLElement, row?: Row, remove = false) => {
        setFailure('');
        const title = document.createElement('span');
        title.textContent = row ? (remove ? t.deletecategoryheading.replace('{$a}', row.name) : t.edit) : section.add;
        openSchemaModal<Rows>({
            formClass: 'mod_smarturl\\form\\schema_item',
            args: {section: tab, id: row?.id ?? 0, remove: Number(remove)},
            modalConfig: {title: title.innerHTML, large: false},
            saveButtonText: remove ? t.delete : t.savechanges,
            saveButtonClasses: remove ? 'btn-danger' : undefined,
            returnFocus: opener,
        }, setRows, setFailure);
    };
    const matches = rows[tab].filter(row => (!status || row.enabled === (status === 'active'))
        && [row.name, row.detail, ...row.columns].some(text => text.toLocaleLowerCase().includes(queryApplied)));
    const total = matches.length;
    const options = [12, 24, 48, 96].filter(size => size < total);
    if (total <= 500) {
        options.push(0);
    }
    const size = options.includes(perPage) ? perPage : options.at(-1) ?? 12;
    const span = size || Math.max(1, total);
    const current = Math.min(page, Math.max(0, Math.ceil(total / span) - 1));
    const offset = current * span;
    const range = t.pagerange.replace('{$a->from}', String(total ? offset + 1 : 0))
        .replace('{$a->to}', String(Math.min(offset + span, total))).replace('{$a->total}', String(total));
    const clear = () => { setQuery(''); setStatus(''); setPage(0); };

    return <div className="smu-schema" ref={root}>
        <p className="text-body-secondary">{t.adminconfigsubtitle}</p>
        <nav className="nav nav-tabs mb-3" aria-label={t.settings}>
            {props.sections.map(item => <a key={item.key} href={props.adminUrl + '?tab=' + item.key}
                className={'nav-link' + (item.key === tab ? ' active' : '')} aria-current={item.key === tab ? 'page' : undefined}
                onClick={event => {
                    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                        event.preventDefault();
                        setTab(item.key);
                        clear();
                        window.history.replaceState(null, '', event.currentTarget.href);
                    }
                }}>{item.title} <span className="badge rounded-pill smu-state">{rows[item.key].length}</span></a>)}
        </nav>
        {failure && <div className="alert alert-danger" role="alert">{failure}</div>}
        <div className="smu-list-toolbar d-flex align-items-center flex-wrap gap-2 mb-3">
            <input className="form-control" type="search" aria-label={t.search} placeholder={t.search} value={query}
                onChange={event => { setQuery(event.target.value); setPage(0); }}/>
            <select className="form-select smu-status-filter" value={status} aria-label={t.status}
                onChange={event => { setStatus(event.target.value); setPage(0); }}>
                <option value="">{t.status}</option><option value="active">{t.enabled}</option>
                <option value="inactive">{t.disabled}</option>
            </select>
            {status && <button type="button" className="btn btn-outline-secondary smu-iconpill"
                onClick={() => { setStatus(''); setPage(0); }} title={t.clearfilters} aria-label={t.clearfilters}
                dangerouslySetInnerHTML={{__html: props.clearIcon}}/>}
            <div className="smu-list-actions d-flex flex-wrap gap-2">
                <a href={props.settingsUrl} className="btn btn-outline-secondary"><Icon name="gear"/> {t.settings}</a>
                <button type="button" className="btn btn-primary" onClick={event => open(event.currentTarget)}>
                    <Icon name="plus"/> {section.add}
                </button>
            </div>
        </div>
        <div className="card">
            <div className="table-responsive smu-list-table" data-region="tablewrap">
                <table className="table table-hover align-middle mb-0">
                    <caption className="visually-hidden">{section.title}</caption>
                    <thead><tr>
                        <th scope="col">{t.name}</th>
                        {section.columns.map(column => <th scope="col" key={column}>{column}</th>)}
                        <th scope="col" className="smu-fit">{t.status}</th>
                        <th scope="col" className="smu-fit"><span className="visually-hidden">{t.actions}</span></th>
                    </tr></thead>
                    <tbody>{matches.slice(offset, offset + span).map(row => <tr key={row.id}>
                        <th scope="row">
                            <a href={'#item-' + row.id} onClick={event => { event.preventDefault(); open(event.currentTarget, row); }}>
                                {row.name}
                            </a>
                            {row.detail && <div className="small text-body-secondary"><code>{row.detail}</code></div>}
                        </th>
                        {row.columns.map((column, index) => <td key={index}>{column}</td>)}
                        <td><span className={'badge rounded-pill smu-state' + (row.enabled ? ' smu-state-on' : '')}>
                            {row.enabled ? t.enabled : t.disabled}
                        </span></td>
                        <td><div className="smu-row-actions">
                            <button type="button" className="btn btn-outline-secondary smu-iconpill tone-primary"
                                aria-label={t.edit + ' ' + row.name} title={t.edit} onClick={event => open(event.currentTarget, row)}>
                                <Icon name="pen"/>
                            </button>
                            <button type="button" className="btn btn-outline-secondary smu-iconpill tone-danger"
                                aria-label={t.delete + ' ' + row.name} title={t.delete} onClick={event => open(event.currentTarget, row, true)}>
                                <Icon name="trash"/>
                            </button>
                        </div></td>
                    </tr>)}</tbody>
                </table>
                {!total && <div className="p-4 text-center text-body-secondary" data-region="empty">
                    <p>{query || status ? t.emptyresults : t.listempty}</p>
                    <button type="button" className="btn btn-outline-secondary" onClick={event =>
                        query || status ? clear() : open(event.currentTarget)}>{query || status ? t.clearfilters : section.add}</button>
                </div>}
            </div>
            <div className="smu-list-pager border-top px-3 py-2 d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <label className="d-flex align-items-center gap-2 small">{t.pagerlabel}
                    <select className="form-select form-select-sm w-auto" value={size}
                        onChange={event => { setPerPage(Number(event.target.value)); setPage(0); }}>
                        {options.map(option => <option key={option} value={option}>{option || t.all}</option>)}
                    </select>
                </label>
                <div className="d-flex align-items-center gap-2">
                    <span className="small text-body-secondary" role="status">{range}</span>
                    <button type="button" className="btn btn-link btn-sm" aria-label={t.previous} title={t.previous}
                        disabled={offset === 0} onClick={() => setPage(current - 1)}><span dangerouslySetInnerHTML={{__html: props.previousIcon}}/></button>
                    <button type="button" className="btn btn-link btn-sm" aria-label={t.next} title={t.next}
                        disabled={offset + span >= total} onClick={() => setPage(current + 1)}><span dangerouslySetInnerHTML={{__html: props.nextIcon}}/></button>
                </div>
            </div>
        </div>
    </div>;
};

export default AdminConfig;
