/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * High-volume metadata explorer with debounced search, group filter chips (dd-chips),
 * cards and a compact table.
 *
 * @module     mod_smarturl/components/viewer/MetadataExplorer
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useMemo, useRef, useState} from 'react';
import {installSelectMenus} from '../../lib/selectMenus';
import {useDebouncedValue} from '../../hooks/useDebouncedValue';
import {computeGroupFacets, filterByQuery, groupEntries} from '../../lib/metadata';
import type {MetadataEntry} from '../../types';
import MetadataValue from './MetadataValue';

interface MetadataExplorerProps {
    entries: MetadataEntry[];
    strings: Record<string, string>;
}

const COLLAPSED_LIMIT = 18;

const MetadataExplorer = ({entries, strings}: MetadataExplorerProps) => {
    const [searchText, setSearchText] = useState('');
    const [activeGroup, setActiveGroup] = useState<string>('');
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [showAll, setShowAll] = useState(false);
    const controls = useRef<HTMLElement>(null);
    useEffect(() => controls.current ? installSelectMenus(controls.current) : undefined, []);

    const debouncedQuery = useDebouncedValue(searchText, 250);

    const queryMatched = useMemo(
        () => filterByQuery(entries, debouncedQuery),
        [entries, debouncedQuery]
    );

    const groupFacets = useMemo(
        () => computeGroupFacets(queryMatched),
        [queryMatched]
    );

    const visibleEntries = useMemo(
        () => (activeGroup ? queryMatched.filter((e) => e.group === activeGroup) : queryMatched),
        [queryMatched, activeGroup]
    );

    const pagedEntries = useMemo(
        () => (showAll || visibleEntries.length <= COLLAPSED_LIMIT ? visibleEntries : visibleEntries.slice(0, COLLAPSED_LIMIT)),
        [visibleEntries, showAll]
    );

    const groupedCards = useMemo(
        () => groupEntries(pagedEntries),
        [pagedEntries]
    );

    const clearAll = () => {
        setSearchText('');
        setActiveGroup('');
    };

    return (
        <section ref={controls} aria-labelledby="smu-metadata-title">
            {entries.length <= 6 ? <h2 id="smu-metadata-title" className="h5 mb-3">{strings.metadataheading}</h2>
                : <div className="smu-meta-toolbar">
                <div className="smu-meta-toprow">
                    <h2 id="smu-metadata-title" className="h5 mb-0">
                        {strings.metadataheading ?? 'Resource metadata'}
                    </h2>

                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <div className="btn-group" role="group" aria-label={strings.metadataheading}>
                            <button
                                type="button"
                                className={"btn btn-outline-secondary btn-sm" + (viewMode === "cards" ? " active" : "")}
                                aria-pressed={viewMode === 'cards'}
                                onClick={() => setViewMode('cards')}
                            >
                                {strings.viewcards ?? 'Grouped cards'}
                            </button>
                            <button
                                type="button"
                                className={"btn btn-outline-secondary btn-sm" + (viewMode === "table" ? " active" : "")}
                                aria-pressed={viewMode === 'table'}
                                onClick={() => setViewMode('table')}
                            >
                                {strings.viewtable ?? 'Compact table'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="smu-meta-toprow">
                    <form
                        role="search"
                        className="smu-meta-search"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <label htmlFor="smu-meta-search-input" className="visually-hidden">
                            {strings.metadatasearch ?? 'Search metadata'}
                        </label>
                        <input
                            id="smu-meta-search-input"
                            type="search"
                            className="form-control"
                            value={searchText}
                            onChange={(e) => setSearchText(e.currentTarget.value)}
                            placeholder={strings.metadatasearchplaceholder ?? 'Search attributes, values, tags...'}
                        />
                    </form>

                    <div className="text-muted small" role="status">
                        {visibleEntries.length} / {entries.length}
                    </div>
                </div>

                {groupFacets.length > 0 && (
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <select className="form-select w-auto" aria-label={strings.groupname} value={activeGroup}
                            onChange={event => setActiveGroup(event.target.value)}>
                            <option value="">{strings.allgroups}</option>
                            {activeGroup && !groupFacets.some(facet => facet.name === activeGroup)
                                && <option value={activeGroup}>{activeGroup} (0)</option>}
                            {groupFacets.map(facet => <option key={facet.name} value={facet.name}>
                                {facet.name} ({facet.count})
                            </option>)}
                        </select>
                        {(searchText || activeGroup) && <button type="button" className="btn btn-outline-secondary btn-sm"
                            onClick={clearAll}>{strings.clearfilters}</button>}
                    </div>
                )}

            </div>}

            {visibleEntries.length === 0 ? (
                <div className="dd-empty">
                    <h3 className="dd-empty-title">{strings.emptymetadata ?? 'No metadata matches your search'}</h3>
                    <p className="dd-empty-text">
                        {strings.emptymetadata_hint ?? 'Try clearing active group filters or changing your search query.'}
                    </p>
                    {(debouncedQuery || activeGroup) && (
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={clearAll}>
                            {strings.clearfilters ?? 'Clear all'}
                        </button>
                    )}
                </div>
            ) : viewMode === 'cards' ? (
                <div className="smu-meta-grid">
                    {groupedCards.map(([groupName, items]) => (
                        <article key={groupName} className="smu-card">
                            <h3>{groupName}</h3>
                            <dl className="dd-dl">
                                {items.map((item) => (
                                    <div key={item.id} style={{display: 'contents'}}>
                                        <dt title={item.key}>{item.label}</dt>
                                        <dd><MetadataValue entry={item}/></dd>
                                    </div>
                                ))}
                            </dl>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="table-responsive smu-card">
                    <table className="table table-hover align-middle mb-0">
                        <caption className="visually-hidden">{strings.metadataheading}</caption>
                        <thead>
                            <tr>
                                <th scope="col">{strings.groupname}</th>
                                <th scope="col">{strings.metadatatypes}</th>
                                <th scope="col">{strings.metavalue}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedEntries.map((item) => (
                                <tr key={item.id}>
                                    <td><span className="badge text-bg-light">{item.group}</span></td>
                                    <td>
                                        <div className="fw-semibold">{item.label}</div>
                                        <div className="text-muted small">{item.key}</div>
                                    </td>
                                    <td><MetadataValue entry={item}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {visibleEntries.length > COLLAPSED_LIMIT && (
                <div className="mt-3 text-center">
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll
                            ? (strings.showless ?? 'Show fewer')
                            : (strings.showmore ?? `Show all (${visibleEntries.length})`).replace('{$a}', String(visibleEntries.length))}
                    </button>
                </div>
            )}
        </section>
    );
};

export default MetadataExplorer;
