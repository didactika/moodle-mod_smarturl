/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Didactika schema & dynamic URL parameter studio mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/AdminConfig
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useState} from 'react';
import PageHeader from './components/common/PageHeader';
import * as api from './services/api';
import type {AdminConfigProps, MetadataTypeRecord, ParamDefRecord} from './types';

const AdminConfig = (props: AdminConfigProps) => {
    const [tab, setTab] = useState<'meta' | 'params'>('meta');
    const [metaTypes, setMetaTypes] = useState<MetadataTypeRecord[]>(props.metaTypes);
    const [paramDefs, setParamDefs] = useState<ParamDefRecord[]>(props.paramDefs);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Metadata type form state.
    const [mtForm, setMtForm] = useState({
        id: 0,
        shortname: '',
        name: '',
        group_name: 'General',
        datatype: 'TEXT',
        display_priority: 'SECONDARY',
        searchable: true,
        filterable: true,
        enabled: true,
    });

    // Dynamic URL parameter form state.
    const [pdForm, setPdForm] = useState({
        id: 0,
        shortname: '',
        name: '',
        source_type: 'BUILTIN',
        source_key: '',
        default_query_param: '',
        enabled: true,
    });

    // Live URL tester state.
    const [testTemplate, setTestTemplate] = useState('https://cdn.example.org/watch/{{course_shortname}}?u={{user_username}}');
    const [testResult, setTestResult] = useState<string | null>(null);

    const submitMetaType = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        api.saveMetaType(mtForm).then((saved) => {
            setMetaTypes((prev) => {
                const rest = prev.filter((item) => item.id !== saved.id);
                return [...rest, saved];
            });
            setMtForm({
                id: 0,
                shortname: '',
                name: '',
                group_name: 'General',
                datatype: 'TEXT',
                display_priority: 'SECONDARY',
                searchable: true,
                filterable: true,
                enabled: true,
            });
            return null;
        }, (err: unknown) => {
            setErrorMsg(err instanceof Error ? err.message : 'Failed to save metadata type');
            return null;
        });
    };

    const removeMetaType = (id: number) => {
        api.deleteMetaType(id).then(() => {
            setMetaTypes((prev) => prev.filter((item) => item.id !== id));
            return null;
        }, () => null);
    };

    const submitParamDef = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        api.saveParamDef(pdForm).then((saved) => {
            setParamDefs((prev) => {
                const rest = prev.filter((item) => item.id !== saved.id);
                return [...rest, saved];
            });
            setPdForm({
                id: 0,
                shortname: '',
                name: '',
                source_type: 'BUILTIN',
                source_key: '',
                default_query_param: '',
                enabled: true,
            });
            return null;
        }, (err: unknown) => {
            setErrorMsg(err instanceof Error ? err.message : 'Failed to save parameter definition');
            return null;
        });
    };

    const removeParamDef = (id: number) => {
        api.deleteParamDef(id).then(() => {
            setParamDefs((prev) => prev.filter((item) => item.id !== id));
            return null;
        }, () => null);
    };

    const runPreview = () => {
        const bindings = paramDefs
            .filter((pd) => pd.enabled && pd.default_query_param)
            .slice(0, 4)
            .map((pd) => ({
                param: pd.default_query_param ?? '',
                mode: 'def',
                var: pd.shortname,
                value: '',
            }));
        api.previewUrl(testTemplate, 1, bindings).then((res) => {
            setTestResult(res.resolved);
            return null;
        }, () => null);
    };

    return (
        <div className="smu-admin-layout">
            <PageHeader
                title={props.title}
                subtitle={props.subtitle}
                iconLabel="CFG"
                actions={(
                    <a href={props.settingsUrl} className="btn btn-outline-secondary">
                        Plugin settings
                    </a>
                )}
            />

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <div className="dd-segmented" role="tablist">
                <button type="button" aria-pressed={tab === 'meta'} onClick={() => setTab('meta')}>
                    {props.strings.metadatatypes ?? 'Metadata types'} ({metaTypes.length})
                </button>
                <button type="button" aria-pressed={tab === 'params'} onClick={() => setTab('params')}>
                    {props.strings.paramdefs ?? 'Dynamic URL parameters'} ({paramDefs.length})
                </button>
            </div>

            {tab === 'meta' ? (
                <div className="d-grid gap-3">
                    <form className="smu-card" onSubmit={submitMetaType}>
                        <h3>{props.strings.addmetatype ?? 'Add metadata type'}</h3>
                        <div className="smu-form-grid">
                            <div>
                                <label className="form-label">{props.strings.shortname ?? 'Shortname'}</label>
                                <input
                                    className="form-control"
                                    required
                                    value={mtForm.shortname}
                                    onChange={(e) => setMtForm({...mtForm, shortname: e.currentTarget.value})}
                                    placeholder="curriculum_code"
                                />
                            </div>
                            <div>
                                <label className="form-label">Name</label>
                                <input
                                    className="form-control"
                                    required
                                    value={mtForm.name}
                                    onChange={(e) => setMtForm({...mtForm, name: e.currentTarget.value})}
                                    placeholder="Curriculum code"
                                />
                            </div>
                            <div>
                                <label className="form-label">{props.strings.groupname ?? 'Group'}</label>
                                <input
                                    className="form-control"
                                    value={mtForm.group_name}
                                    onChange={(e) => setMtForm({...mtForm, group_name: e.currentTarget.value})}
                                    placeholder="Academic"
                                />
                            </div>
                            <div>
                                <label className="form-label">{props.strings.datatype ?? 'Data type'}</label>
                                <select
                                    className="form-select"
                                    value={mtForm.datatype}
                                    onChange={(e) => setMtForm({...mtForm, datatype: e.currentTarget.value})}
                                >
                                    {props.datatypes.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">{props.strings.priority ?? 'Priority'}</label>
                                <select
                                    className="form-select"
                                    value={mtForm.display_priority}
                                    onChange={(e) => setMtForm({...mtForm, display_priority: e.currentTarget.value})}
                                >
                                    {props.priorities.map((pr) => <option key={pr} value={pr}>{pr}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap gap-3 mt-3 align-items-center">
                            <label className="form-check-label d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={mtForm.searchable}
                                    onChange={(e) => setMtForm({...mtForm, searchable: e.currentTarget.checked})}
                                />
                                {props.strings.searchable ?? 'Searchable'}
                            </label>
                            <label className="form-check-label d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={mtForm.filterable}
                                    onChange={(e) => setMtForm({...mtForm, filterable: e.currentTarget.checked})}
                                />
                                {props.strings.filterable ?? 'Filterable'}
                            </label>
                            <button type="submit" className="btn btn-primary ms-auto">
                                {props.strings.savechanges ?? 'Save changes'}
                            </button>
                        </div>
                    </form>

                    <div className="smu-card table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>{props.strings.shortname ?? 'Shortname'}</th>
                                    <th>Name</th>
                                    <th>{props.strings.groupname ?? 'Group'}</th>
                                    <th>{props.strings.datatype ?? 'Data type'}</th>
                                    <th>{props.strings.priority ?? 'Priority'}</th>
                                    <th/>
                                </tr>
                            </thead>
                            <tbody>
                                {metaTypes.map((mt) => (
                                    <tr key={mt.id}>
                                        <td><code>{mt.shortname}</code></td>
                                        <td>{mt.name}</td>
                                        <td><span className="badge text-bg-light">{mt.group_name}</span></td>
                                        <td><span className="badge text-bg-secondary">{mt.datatype}</span></td>
                                        <td>{mt.display_priority}</td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm me-1"
                                                onClick={() => setMtForm({
                                                    id: mt.id,
                                                    shortname: mt.shortname,
                                                    name: mt.name,
                                                    group_name: mt.group_name,
                                                    datatype: mt.datatype,
                                                    display_priority: mt.display_priority,
                                                    searchable: Boolean(mt.searchable),
                                                    filterable: Boolean(mt.filterable),
                                                    enabled: Boolean(mt.enabled),
                                                })}
                                            >
                                                {props.strings.edit ?? 'Edit'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeMetaType(mt.id)}
                                            >
                                                {props.strings.delete ?? 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="d-grid gap-3">
                    <form className="smu-card" onSubmit={submitParamDef}>
                        <h3>{props.strings.addparamdef ?? 'Add dynamic parameter'}</h3>
                        <div className="smu-form-grid">
                            <div>
                                <label className="form-label">{props.strings.shortname ?? 'Shortname'}</label>
                                <input
                                    className="form-control"
                                    required
                                    value={pdForm.shortname}
                                    onChange={(e) => setPdForm({...pdForm, shortname: e.currentTarget.value})}
                                    placeholder="campus_code"
                                />
                            </div>
                            <div>
                                <label className="form-label">Name</label>
                                <input
                                    className="form-control"
                                    required
                                    value={pdForm.name}
                                    onChange={(e) => setPdForm({...pdForm, name: e.currentTarget.value})}
                                    placeholder="Campus profile field"
                                />
                            </div>
                            <div>
                                <label className="form-label">{props.strings.sourcetype ?? 'Source type'}</label>
                                <select
                                    className="form-select"
                                    value={pdForm.source_type}
                                    onChange={(e) => setPdForm({...pdForm, source_type: e.currentTarget.value})}
                                >
                                    {props.sourceTypes.map((st) => <option key={st} value={st}>{st}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">{props.strings.sourcekey ?? 'Source key / value'}</label>
                                <input
                                    className="form-control"
                                    required
                                    value={pdForm.source_key}
                                    onChange={(e) => setPdForm({...pdForm, source_key: e.currentTarget.value})}
                                    placeholder="user.username or profile_shortname"
                                />
                            </div>
                            <div>
                                <label className="form-label">{props.strings.defaultqueryparam ?? 'Suggested query param'}</label>
                                <input
                                    className="form-control"
                                    value={pdForm.default_query_param}
                                    onChange={(e) => setPdForm({...pdForm, default_query_param: e.currentTarget.value})}
                                    placeholder="campus"
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-end">
                            <button type="submit" className="btn btn-primary">
                                {props.strings.savechanges ?? 'Save changes'}
                            </button>
                        </div>
                    </form>

                    <div className="smu-card">
                        <h3>{props.strings.testresolution ?? 'Test URL resolution'}</h3>
                        <div className="d-flex flex-wrap gap-2">
                            <input
                                className="form-control flex-grow-1"
                                value={testTemplate}
                                onChange={(e) => setTestTemplate(e.currentTarget.value)}
                            />
                            <button type="button" className="btn btn-outline-primary" onClick={runPreview}>
                                {props.strings.testresolution ?? 'Test URL resolution'}
                            </button>
                        </div>
                        {testResult !== null && (
                            <div className="smu-preview-box mt-2">{testResult}</div>
                        )}
                    </div>

                    <div className="smu-card table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>{props.strings.shortname ?? 'Shortname'}</th>
                                    <th>Name</th>
                                    <th>{props.strings.sourcetype ?? 'Source type'}</th>
                                    <th>{props.strings.sourcekey ?? 'Source key'}</th>
                                    <th>{props.strings.defaultqueryparam ?? 'Query param'}</th>
                                    <th/>
                                </tr>
                            </thead>
                            <tbody>
                                {paramDefs.map((pd) => (
                                    <tr key={pd.id}>
                                        <td><code>{`{{${pd.shortname}}}`}</code></td>
                                        <td>{pd.name}</td>
                                        <td><span className="badge text-bg-light">{pd.source_type}</span></td>
                                        <td><code>{pd.source_key}</code></td>
                                        <td>{pd.default_query_param ?? '—'}</td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm me-1"
                                                onClick={() => setPdForm({
                                                    id: pd.id,
                                                    shortname: pd.shortname,
                                                    name: pd.name,
                                                    source_type: pd.source_type,
                                                    source_key: pd.source_key,
                                                    default_query_param: pd.default_query_param ?? '',
                                                    enabled: Boolean(pd.enabled),
                                                })}
                                            >
                                                {props.strings.edit ?? 'Edit'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeParamDef(pd.id)}
                                            >
                                                {props.strings.delete ?? 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminConfig;
