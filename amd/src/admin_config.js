// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Schema & Dynamic URL Parameters admin controller for Moodle 4.5 - 5.2.
 *
 * @module     mod_smarturl/admin_config
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';

/**
 * Escapes HTML special characters safely.
 *
 * @param {string} value Raw string.
 * @returns {string}
 */
const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Calls a Moodle external web service function returning a Promise.
 *
 * @param {string} methodname Method name.
 * @param {Object} args Arguments map.
 * @returns {Promise}
 */
const ws = (methodname, args) => Ajax.call([{methodname, args}])[0];

/**
 * Initializes the AdminConfig studio on a rendered container.
 *
 * @param {string} rootId Container ID.
 */
export const init = (rootId) => {
    const root = document.getElementById(rootId);
    if (!root) {
        return;
    }

    const payload = JSON.parse(root.dataset.payload || '{}');
    let metaTypes = Array.isArray(payload.metaTypes) ? payload.metaTypes : [];
    let paramDefs = Array.isArray(payload.paramDefs) ? payload.paramDefs : [];
    const strings = payload.strings || {};

    const errBanner = root.querySelector('[data-region="error-banner"]');
    const metaTbody = root.querySelector('[data-region="meta-tbody"]');
    const paramTbody = root.querySelector('[data-region="param-tbody"]');
    const previewOut = root.querySelector('[data-region="preview-out"]');

    const showError = (err) => {
        if (!errBanner) {
            return;
        }
        errBanner.textContent = (err && (err.message || err.error)) || 'Request failed';
        errBanner.hidden = false;
    };

    const clearError = () => {
        if (errBanner) {
            errBanner.hidden = true;
        }
    };

    const renderMetaRows = () => {
        if (!metaTbody) {
            return;
        }
        metaTbody.innerHTML = metaTypes.map((mt) =>
            `<tr>` +
            `<td><code>${esc(mt.shortname)}</code></td>` +
            `<td>${esc(mt.name)}</td>` +
            `<td>${esc(mt.group_name)}</td>` +
            `<td><span class="dd-tag">${esc(mt.datatype)}</span></td>` +
            `<td>${esc(mt.display_priority)}</td>` +
            `<td>${Number(mt.enabled) ? 'Yes' : 'No'}</td>` +
            `<td><button type="button" class="btn btn-sm btn-outline-danger" data-del-meta="${Number(mt.id)}">` +
            `${esc(strings.delete || 'Delete')}</button></td>` +
            `</tr>`
        ).join('');
    };

    const renderParamRows = () => {
        if (!paramTbody) {
            return;
        }
        paramTbody.innerHTML = paramDefs.map((pd) =>
            `<tr>` +
            `<td><code>{{${esc(pd.shortname)}}}</code></td>` +
            `<td>${esc(pd.name)}</td>` +
            `<td><span class="dd-tag">${esc(pd.source_type)}</span></td>` +
            `<td><code>${esc(pd.source_key)}</code></td>` +
            `<td>${Number(pd.enabled) ? 'Yes' : 'No'}</td>` +
            `<td><button type="button" class="btn btn-sm btn-outline-danger" data-del-param="${Number(pd.id)}">` +
            `${esc(strings.delete || 'Delete')}</button></td>` +
            `</tr>`
        ).join('');
    };

    renderMetaRows();
    renderParamRows();

    root.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('[data-action="tab"]');
        if (tabBtn) {
            const tab = tabBtn.dataset.tab;
            root.querySelectorAll('[data-action="tab"]').forEach((b) => {
                b.classList.toggle('is-active', b.dataset.tab === tab);
            });
            root.querySelectorAll('[data-panel]').forEach((p) => {
                p.hidden = p.dataset.panel !== tab;
            });
            return;
        }

        const delMeta = e.target.closest('[data-del-meta]');
        if (delMeta) {
            const id = Number(delMeta.dataset.delMeta);
            clearError();
            ws('mod_smarturl_delete_meta_type', {id}).then(() => {
                metaTypes = metaTypes.filter((m) => Number(m.id) !== id);
                renderMetaRows();
                return null;
            }).catch(showError);
            return;
        }

        const delParam = e.target.closest('[data-del-param]');
        if (delParam) {
            const id = Number(delParam.dataset.delParam);
            clearError();
            ws('mod_smarturl_delete_param_def', {id}).then(() => {
                paramDefs = paramDefs.filter((p) => Number(p.id) !== id);
                renderParamRows();
                return null;
            }).catch(showError);
        }
    });

    const metaForm = root.querySelector('[data-form="meta-type"]');
    if (metaForm) {
        metaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();
            const fd = new FormData(metaForm);
            ws('mod_smarturl_save_meta_type', {
                id: 0,
                shortname: String(fd.get('shortname') || ''),
                name: String(fd.get('name') || ''),
                groupname: String(fd.get('group_name') || 'General'),
                datatype: String(fd.get('datatype') || 'TEXT'),
                displaypriority: String(fd.get('display_priority') || 'SECONDARY'),
                searchable: metaForm.querySelector('[name="searchable"]').checked ? 1 : 0,
                filterable: metaForm.querySelector('[name="filterable"]').checked ? 1 : 0,
                enabled: metaForm.querySelector('[name="enabled"]').checked ? 1 : 0,
                sortorder: (metaTypes.length + 1) * 10,
            }).then((saved) => {
                metaTypes.push(saved);
                renderMetaRows();
                metaForm.reset();
                return null;
            }).catch(showError);
        });
    }

    const paramForm = root.querySelector('[data-form="param-def"]');
    if (paramForm) {
        paramForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();
            const fd = new FormData(paramForm);
            ws('mod_smarturl_save_param_def', {
                id: 0,
                shortname: String(fd.get('shortname') || ''),
                name: String(fd.get('name') || ''),
                sourcetype: String(fd.get('source_type') || 'BUILTIN'),
                sourcekey: String(fd.get('source_key') || ''),
                defaultqueryparam: String(fd.get('default_query_param') || ''),
                enabled: paramForm.querySelector('[name="enabled"]').checked ? 1 : 0,
            }).then((saved) => {
                paramDefs.push(saved);
                renderParamRows();
                paramForm.reset();
                return null;
            }).catch(showError);
        });
    }

    const previewForm = root.querySelector('[data-form="preview"]');
    if (previewForm) {
        previewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();
            const fd = new FormData(previewForm);
            ws('mod_smarturl_preview_url', {
                template: String(fd.get('template') || ''),
                courseid: 1,
                bindings: [{
                    param: String(fd.get('bind_param') || 'env'),
                    mode: 'static',
                    var: '',
                    value: String(fd.get('bind_val') || 'demo'),
                }],
            }).then((res) => {
                if (previewOut) {
                    previewOut.querySelector('code').textContent = res.resolved || '';
                    previewOut.hidden = false;
                }
                return null;
            }).catch(showError);
        });
    }
};
