/**
 * This file is part of Moodle - https://moodle.org/
 *
 * The catalogue of the site, drawn as the working list of the Didactika design system: the header with what the page manages
 * and its actions, a tab for each section with its count, and a card with the toolbar (the search, the status chips with their
 * counts and the button that clears them), the table of the section, its empty state and the pager. The section, the search,
 * the status and the page are kept in the address; items are added, edited and deleted in the modal forms of Moodle.
 *
 * @module     mod_smarturl/AdminConfig
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useMemo, useRef, useState, useTransition} from 'react';
import CatalogueEmpty from './components/admin/CatalogueEmpty';
import CatalogueFilters from './components/admin/CatalogueFilters';
import CatalogueHeader from './components/admin/CatalogueHeader';
import CataloguePager from './components/admin/CataloguePager';
import CatalogueSkeleton from './components/admin/CatalogueSkeleton';
import CatalogueTable from './components/admin/CatalogueTable';
import {useDebouncedValue} from './hooks/useDebouncedValue';
import {hasStatus, pageOf, PAGE_SIZES, searched} from './lib/catalogue';
import type {CatalogueRow, CatalogueRows, CatalogueSection, SectionKey, Status} from './lib/catalogue';
import {openSchemaModal} from './lib/schemaModal';
import {installSelectMenus} from './lib/selectMenus';

interface Props {
    sections: CatalogueSection[];
    tab: SectionKey;
    rows: CatalogueRows;
    settingsUrl: string;
    adminUrl: string;
    icons: Record<string, string>;
    strings: Record<string, string>;
}

/** What failed to open, and how to try again. */
interface Failure {
    message: string;
    retry: () => void;
}

/** How long the search waits for the person to stop typing, in milliseconds. */
const SEARCH_DELAY = 300;

/**
 * Reads the state the address keeps.
 *
 * @returns The search, the status and the page.
 */
const fromAddress = () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    return {
        query: (params.get('q') ?? '').trim(),
        status: (status === 'active' || status === 'inactive' ? status : '') as Status,
        page: Math.max(0, Number(params.get('page') ?? 1) - 1) || 0,
    };
};

const AdminConfig = (props: Props) => {
    const {strings: t, icons} = props;
    const initial = useMemo(fromAddress, []);
    const [sectionKey, setSectionKey] = useState(props.tab);
    const [rows, setRows] = useState(props.rows);
    const [typed, setTyped] = useState(initial.query);
    const [status, setStatus] = useState<Status>(initial.status);
    const [page, setPage] = useState(initial.page);
    const [perPage, setPerPage] = useState(PAGE_SIZES[0]);
    const [failure, setFailure] = useState(null as Failure | null);
    const [pending, startTransition] = useTransition();
    const root = useRef<HTMLDivElement>(null);
    const debounced = useDebouncedValue(typed.trim(), SEARCH_DELAY);
    // Clearing the search applies at once; only typing waits for the person to stop.
    const query = typed.trim() ? debounced : '';
    const section = props.sections.find(item => item.key === sectionKey) ?? props.sections[0];

    // The chips count what the search leaves, so a chip never promises rows that are not there.
    const found = useMemo(() => searched(rows[section.key], query), [rows, section.key, query]);
    const matching = useMemo(() => found.filter(row => hasStatus(row, status)), [found, status]);
    const count = matching.length;
    const view = pageOf(count, perPage, page);
    const narrowed = Boolean(query || status);
    const range = t.pagerange.replace('{$a->from}', String(count ? view.offset + 1 : 0))
        .replace('{$a->to}', String(Math.min(view.offset + view.span, count))).replace('{$a->total}', String(count));

    useEffect(() => root.current ? installSelectMenus(root.current) : undefined, []);

    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', section.key);
        const kept = [['q', query], ['status', status], ['page', view.current ? String(view.current + 1) : '']] as const;
        kept.forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState(null, '', url);
    }, [section.key, query, status, view.current]);

    const update = (change: () => void) => startTransition(change);

    const clearFilters = () => update(() => {
        setTyped('');
        setStatus('');
        setPage(0);
    });

    const open = (opener: HTMLElement, row?: CatalogueRow, remove = false) => {
        setFailure(null);
        const title = document.createElement('span');
        title.textContent = section.add;
        if (row) {
            title.textContent = remove ? t.deletecategoryheading.replace('{$a}', row.name) : t.edit;
        }
        openSchemaModal<CatalogueRows>({
            formClass: 'mod_smarturl\\form\\schema_item',
            args: {section: section.key, id: row?.id ?? 0, remove: Number(remove)},
            modalConfig: {title: title.innerHTML, large: false, scrollable: true},
            saveButtonText: remove ? t.delete : t.savechanges,
            saveButtonClasses: remove ? 'btn-danger' : undefined,
            returnFocus: opener,
        }, setRows, message => setFailure({message, retry: () => open(opener, row, remove)}));
    };

    return <div className="mod-smarturl" data-region="catalogue" ref={root}>
        <div className="d-grid gap-3">
            <CatalogueHeader sections={props.sections} current={section} rows={rows} adminUrl={props.adminUrl}
                settingsUrl={props.settingsUrl} icons={icons} strings={t} onAdd={open}
                onSection={key => update(() => {
                    setSectionKey(key);
                    setTyped('');
                    setStatus('');
                    setPage(0);
                })}/>
            <div className="d-grid gap-3 mt-2" data-region="list">
                <CatalogueFilters search={typed} status={status} narrowed={narrowed} icons={icons} strings={t}
                    counts={{
                        '': found.length,
                        active: found.filter(row => hasStatus(row, 'active')).length,
                        inactive: found.filter(row => hasStatus(row, 'inactive')).length,
                    }}
                    onSearch={text => {
                        setTyped(text);
                        update(() => setPage(0));
                    }}
                    onStatus={value => update(() => {
                        setStatus(value);
                        setPage(0);
                    })}
                    onClear={clearFilters}/>
                <div className="card">
                    {failure && <div className="alert alert-danger" role="alert" data-region="error">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                            <span>{failure.message}</span>
                            <button type="button" className="btn btn-outline-danger btn-sm" data-action="retry"
                                onClick={() => failure.retry()}>{t.retry}</button>
                        </div>
                    </div>}
                    {(count > 0 || pending) && <div className="table-responsive" data-region="tablewrap" aria-busy={pending}>
                        {pending
                            ? <CatalogueSkeleton section={section} strings={t}
                                detailed={rows[section.key].some(row => row.detail)}/>
                            : <CatalogueTable section={section} rows={matching.slice(view.offset, view.offset + view.span)}
                                icons={icons} strings={t} onOpen={open}/>}
                    </div>}
                    {!count && !pending && <div data-region="empty">
                        <CatalogueEmpty section={section} filtered={narrowed} icons={icons} strings={t}
                            onAdd={opener => open(opener)}
                            onClear={clearFilters}/>
                    </div>}
                    {count > 0 && !pending && <div className="px-3 py-2" data-region="foot">
                        <CataloguePager sizes={view.sizes} size={view.size} range={range} first={view.first} last={view.last}
                            icons={icons} strings={t}
                            onSize={size => update(() => {
                                setPerPage(size);
                                setPage(0);
                            })}
                            onPage={step => update(() => setPage(view.current + step))}/>
                    </div>}
                </div>
            </div>
        </div>
    </div>;
};

export default AdminConfig;
