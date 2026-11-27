/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Dynamic single-row form builder for URL parameters and structured metadata in mod_form.
 *
 * @module     mod_smarturl/FormBuilder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useMemo, useState} from 'react';

interface CatalogItem {
    shortname: string;
    name: string;
    group?: string;
    datatype?: string;
    source_type?: string;
    default_query_param?: string | null;
}

interface BuilderRow {
    id: string;
    key: string;
    mode: string;
    varName: string;
    customKey: string;
    value: string;
}

interface FormBuilderProps {
    kind: 'params' | 'metadata';
    initialRows: Array<Record<string, string>>;
    catalog: CatalogItem[];
    locked: boolean;
    strings: Record<string, string>;
}

const makeId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmptyRow = (): BuilderRow => ({
    id: makeId(),
    key: '',
    mode: 'def',
    varName: '',
    customKey: '',
    value: '',
});

const FormBuilder = ({kind, initialRows, catalog, locked, strings}: FormBuilderProps) => {
    const knownKeys = useMemo(() => new Set(catalog.map((c) => c.shortname)), [catalog]);

    const [rows, setRows] = useState<BuilderRow[]>(() => {
        if (!Array.isArray(initialRows) || initialRows.length === 0) {
            return [createEmptyRow()];
        }
        return initialRows.map((row) => {
            if (kind === 'params') {
                const isStatic = (row.mode || 'def') === 'static';
                return {
                    id: makeId(),
                    key: row.param || '',
                    mode: isStatic ? 'static' : 'def',
                    varName: isStatic ? '__static__' : (row.var || ''),
                    customKey: '',
                    value: row.value || '',
                };
            }
            const rawKey = row.key || '';
            const isKnown = knownKeys.has(rawKey);
            return {
                id: makeId(),
                key: isKnown ? rawKey : '__custom__',
                mode: 'meta',
                varName: '',
                customKey: isKnown ? '' : rawKey,
                value: row.value || '',
            };
        });
    });

    const [baseUrl, setBaseUrl] = useState<string>(() => {
        const urlEl = document.getElementById('id_externalurl') as HTMLInputElement | null;
        return urlEl?.value ?? '';
    });

    useEffect(() => {
        if (kind !== 'params') {
            return undefined;
        }
        const urlEl = document.getElementById('id_externalurl') as HTMLInputElement | null;
        if (!urlEl) {
            return undefined;
        }
        const onInput = () => setBaseUrl(urlEl.value);
        urlEl.addEventListener('input', onInput);
        urlEl.addEventListener('change', onInput);
        return () => {
            urlEl.removeEventListener('input', onInput);
            urlEl.removeEventListener('change', onInput);
        };
    }, [kind]);

    const serialized = useMemo(() => {
        if (kind === 'params') {
            return JSON.stringify(
                rows
                    .filter((r) => r.key.trim() !== '' && (r.varName === '__static__' ? r.value.trim() !== '' : r.varName.trim() !== ''))
                    .map((r) => (
                        r.varName === '__static__'
                            ? {param: r.key.trim(), mode: 'static', var: '', value: r.value.trim()}
                            : {param: r.key.trim(), mode: 'def', var: r.varName.trim(), value: ''}
                    ))
            );
        }
        return JSON.stringify(
            rows
                .map((r) => ({
                    key: (r.key === '__custom__' ? r.customKey : r.key).trim(),
                    value: r.value.trim(),
                }))
                .filter((r) => r.key !== '' && r.value !== '')
        );
    }, [kind, rows]);

    useEffect(() => {
        const targetName = kind === 'params' ? 'parameters_json' : 'metadata_json';
        const hidden = document.querySelector(`input[name="${targetName}"]`) as HTMLInputElement | null;
        if (hidden) {
            hidden.value = serialized;
        }
    }, [kind, serialized]);

    const groupedMeta = useMemo(() => {
        const map: Record<string, CatalogItem[]> = {};
        for (const item of catalog) {
            const g = item.group || 'General';
            if (!map[g]) {
                map[g] = [];
            }
            map[g].push(item);
        }
        return Object.entries(map);
    }, [catalog]);

    const updateRow = (id: string, patch: Partial<BuilderRow>) => {
        setRows((prev) => prev.map((r) => (r.id === id ? {...r, ...patch} : r)));
    };

    const insertRowAfter = (id: string) => {
        if (locked) {
            return;
        }
        setRows((prev) => {
            const idx = prev.findIndex((r) => r.id === id);
            const next = [...prev];
            next.splice(idx + 1, 0, createEmptyRow());
            return next;
        });
    };

    const removeRow = (id: string) => {
        if (locked) {
            return;
        }
        setRows((prev) => (prev.length <= 1 ? [createEmptyRow()] : prev.filter((r) => r.id !== id)));
    };

    const insertTokenIntoUrl = (shortname: string) => {
        if (locked) {
            return;
        }
        const urlEl = document.getElementById('id_externalurl') as HTMLInputElement | null;
        if (!urlEl) {
            return;
        }
        const token = `{{${shortname}}}`;
        const start = urlEl.selectionStart ?? urlEl.value.length;
        const end = urlEl.selectionEnd ?? urlEl.value.length;
        const nextVal = `${urlEl.value.slice(0, start)}${token}${urlEl.value.slice(end)}`;
        urlEl.value = nextVal;
        urlEl.dispatchEvent(new Event('input', {bubbles: true}));
        urlEl.focus();
    };

    const previewUrl = useMemo(() => {
        if (kind !== 'params') {
            return '';
        }
        const active = rows.filter((r) => r.key.trim() !== '' && r.varName.trim() !== '');
        if (!baseUrl.trim() && active.length === 0) {
            return '';
        }
        const query = active.map((r) => {
            const val = r.varName === '__static__' ? r.value.trim() : `{${r.varName.trim()}}`;
            return `${encodeURIComponent(r.key.trim())}=${val}`;
        });
        if (query.length === 0) {
            return baseUrl;
        }
        const sep = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl || 'https://...'}${sep}${query.join('&')}`;
    }, [kind, baseUrl, rows]);

    return (
        <div className="smu-form-builder">
            {kind === 'params' && catalog.length > 0 && (
                <div className="smu-token-bar">
                    <span className="smu-token-label">{strings.inserttokens ?? 'Quick tokens for URL:'}</span>
                    <div className="smu-token-chips">
                        {catalog.map((item) => (
                            <button
                                key={item.shortname}
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                disabled={locked}
                                onClick={() => insertTokenIntoUrl(item.shortname)}
                                title={item.name}
                            >
                                + {`{{${item.shortname}}}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="smu-builder-rows">
                {rows.map((row) => {
                    const metaDef = kind === 'metadata' ? catalog.find((c) => c.shortname === row.key) : undefined;
                    const showStatic = kind === 'params' && row.varName === '__static__';
                    const showCustomKey = kind === 'metadata' && row.key === '__custom__';

                    return (
                        <div key={row.id} className="smu-builder-row">
                            {kind === 'params' ? (
                                <>
                                    <input
                                        type="text"
                                        className="form-control smu-builder-input"
                                        aria-label={strings.paramqueryname}
                                        placeholder={strings.paramqueryname ?? 'Parameter name (e.g. uid)'}
                                        value={row.key}
                                        disabled={locked}
                                        onChange={(e) => updateRow(row.id, {key: e.target.value})}
                                    />
                                    <select
                                        className="form-select smu-builder-select"
                                        aria-label={strings.paramchoose}
                                        value={row.varName}
                                        disabled={locked}
                                        onChange={(e) => {
                                            const nextVar = e.target.value;
                                            const matched = catalog.find((c) => c.shortname === nextVar);
                                            updateRow(row.id, {
                                                varName: nextVar,
                                                key: row.key || matched?.default_query_param || '',
                                            });
                                        }}
                                    >
                                        <option value="">{strings.paramchoose ?? 'Choose variable...'}</option>
                                        {catalog.map((def) => (
                                            <option key={def.shortname} value={def.shortname}>
                                                {def.name} ({def.shortname})
                                            </option>
                                        ))}
                                        <option value="__static__">{strings.paramstatic ?? 'Custom fixed value'}</option>
                                    </select>
                                    {showStatic && (
                                        <input
                                            type="text"
                                            className="form-control smu-builder-input"
                                            aria-label={strings.paramstatic}
                                            placeholder={strings.paramstatic ?? 'Fixed value'}
                                            value={row.value}
                                            disabled={locked}
                                            onChange={(e) => updateRow(row.id, {value: e.target.value})}
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <select
                                        className="form-select smu-builder-select"
                                        aria-label={strings.choose}
                                        value={row.key}
                                        disabled={locked}
                                        onChange={(e) => updateRow(row.id, {key: e.target.value})}
                                    >
                                        <option value="">{strings.choose ?? 'Choose metadata field...'}</option>
                                        {groupedMeta.map(([group, items]) => (
                                            <optgroup key={group} label={group}>
                                                {items.map((mt) => (
                                                    <option key={mt.shortname} value={mt.shortname}>
                                                        {mt.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                        <option value="__custom__">{strings.customkey ?? 'Custom field name...'}</option>
                                    </select>
                                    {showCustomKey && (
                                        <input
                                            type="text"
                                            className="form-control smu-builder-input"
                                            aria-label={strings.customkey}
                                            placeholder={strings.customkey ?? 'custom_key'}
                                            value={row.customKey}
                                            disabled={locked}
                                            onChange={(e) => updateRow(row.id, {customKey: e.target.value})}
                                        />
                                    )}
                                    {metaDef?.datatype === 'BOOLEAN' ? (
                                        <select className="form-select smu-builder-select" aria-label={strings.metavalue}
                                            disabled={locked} value={row.value} onChange={e => updateRow(row.id, {value: e.target.value})}>
                                            <option value="">{strings.metavalue}</option>
                                            <option value="1">{strings.yes}</option>
                                            <option value="0">{strings.no}</option>
                                        </select>
                                    ) : metaDef?.datatype === 'MULTILINE' ? (
                                        <textarea className="form-control smu-builder-val" aria-label={strings.metavalue}
                                            disabled={locked} value={row.value} onChange={e => updateRow(row.id, {value: e.target.value})}/>
                                    ) : (
                                        <input type={metaDef?.datatype === 'DATE' ? 'date' : metaDef?.datatype === 'NUMBER' ? 'number' : 'text'}
                                            step="any" className="form-control smu-builder-input smu-builder-val"
                                            aria-label={strings.metavalue} placeholder={strings.metavalue} value={row.value}
                                            disabled={locked} onChange={e => updateRow(row.id, {value: e.target.value})}/>
                                    )}
                                </>
                            )}

                            <div className="smu-row-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary smu-iconpill tone-primary"
                                    disabled={locked}
                                    aria-label={strings.addrow ?? 'Add row'}
                                    title={strings.addrow ?? 'Add row'}
                                    onClick={() => insertRowAfter(row.id)}
                                >
                                    <i className="fa fa-plus" aria-hidden="true"/>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary smu-iconpill tone-danger"
                                    disabled={locked}
                                    aria-label={strings.removerow ?? 'Remove row'}
                                    title={strings.removerow ?? 'Remove row'}
                                    onClick={() => removeRow(row.id)}
                                >
                                    <i className="fa fa-trash" aria-hidden="true"/>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {kind === 'params' && previewUrl && (
                <div className="smu-live-preview">
                    <span className="smu-live-preview-label">{strings.previewlabel ?? 'Resolved URL preview:'}</span>
                    <code>{previewUrl}</code>
                </div>
            )}
        </div>
    );
};

export default FormBuilder;
