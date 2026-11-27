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
 * Dynamic single-row form builder for URL parameters and structured metadata (Moodle 4.5 - 5.2).
 *
 * @module     mod_smarturl/form_builders
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Escapes HTML special characters safely.
 *
 * @param {string} value Raw value.
 * @returns {string}
 */
const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Creates a clean empty row state object.
 *
 * @returns {Object}
 */
const emptyRow = () => ({key: '', varName: '', customKey: '', value: ''});

/**
 * Initializes a Didactika dynamic row builder inside mod_form.
 *
 * @param {string} rootId Mount container ID.
 */
export const init = (rootId) => {
    const root = document.getElementById(rootId);
    if (!root) {
        return;
    }

    const cfg = JSON.parse(root.dataset.payload || '{}');
    const kind = cfg.kind === 'metadata' ? 'metadata' : 'params';
    const catalog = Array.isArray(cfg.catalog) ? cfg.catalog : [];
    const locked = Boolean(cfg.locked);
    const strings = cfg.strings || {};
    const knownKeys = new Set(catalog.map((c) => c.shortname));

    const initial = Array.isArray(cfg.initialRows) && cfg.initialRows.length > 0
        ? cfg.initialRows.map((r) => {
            if (kind === 'params') {
                const isStatic = (r.mode || 'def') === 'static';
                return {
                    key: r.param || '',
                    varName: isStatic ? '__static__' : (r.var || ''),
                    customKey: '',
                    value: r.value || '',
                };
            }
            const raw = r.key || '';
            const known = knownKeys.has(raw);
            return {
                key: known ? raw : '__custom__',
                varName: '',
                customKey: known ? '' : raw,
                value: r.value || '',
            };
        })
        : [emptyRow()];

    let rows = initial;
    const urlInput = document.getElementById('id_externalurl');
    const hidden = document.querySelector(`input[name="${kind === 'params' ? 'parameters_json' : 'metadata_json'}"]`);

    const syncHidden = () => {
        if (!hidden) {
            return;
        }
        if (kind === 'params') {
            hidden.value = JSON.stringify(
                rows
                    .filter((r) => r.key.trim() !== '' && (
                        r.varName === '__static__' ? r.value.trim() !== '' : r.varName.trim() !== ''
                    ))
                    .map((r) => (r.varName === '__static__'
                        ? {param: r.key.trim(), mode: 'static', var: '', value: r.value.trim()}
                        : {param: r.key.trim(), mode: 'def', var: r.varName.trim(), value: ''}))
            );
        } else {
            hidden.value = JSON.stringify(
                rows
                    .map((r) => ({
                        key: (r.key === '__custom__' ? r.customKey : r.key).trim(),
                        value: r.value.trim(),
                    }))
                    .filter((r) => r.key !== '' && r.value !== '')
            );
        }
    };

    const groupedMeta = () => {
        const groups = {};
        catalog.forEach((mt) => {
            const g = mt.group || 'General';
            if (!groups[g]) {
                groups[g] = [];
            }
            groups[g].push(mt);
        });
        return Object.entries(groups);
    };

    const buildPreview = () => {
        if (kind !== 'params') {
            return '';
        }
        const base = urlInput ? urlInput.value.trim() : '';
        const query = rows
            .filter((r) => r.key.trim() !== '' && r.varName.trim() !== '')
            .map((r) => `${encodeURIComponent(r.key.trim())}=${r.varName === '__static__' ? r.value.trim() : `{${r.varName}}`}`);
        if (!base && query.length === 0) {
            return '';
        }
        if (query.length === 0) {
            return base;
        }
        return `${base || 'https://...'}${base.includes('?') ? '&' : '?'}${query.join('&')}`;
    };

    const updatePreviewDom = () => {
        const pv = root.querySelector('[data-region="preview"]');
        if (!pv) {
            return;
        }
        const out = buildPreview();
        pv.hidden = !out;
        if (out) {
            pv.querySelector('code').textContent = out;
        }
    };

    const render = () => {
        const dis = locked ? ' disabled' : '';
        let html = '';

        if (kind === 'params' && catalog.length > 0) {
            const chips = catalog.map((c) =>
                `<button type="button" class="btn btn-sm btn-outline-secondary" data-token="${esc(c.shortname)}"${dis}>` +
                `+ {{${esc(c.shortname)}}}</button>`
            ).join('');
            html += `<div class="smu-token-bar">` +
                `<span class="smu-token-label">${esc(strings.inserttokens || 'Quick tokens:')}</span>` +
                `<div class="smu-token-chips">${chips}</div></div>`;
        }

        const groups = kind === 'metadata' ? groupedMeta() : [];
        const rowsHtml = rows.map((row, idx) => {
            let fields = '';
            if (kind === 'params') {
                const opts = catalog.map((c) =>
                    `<option value="${esc(c.shortname)}"${row.varName === c.shortname ? ' selected' : ''}>` +
                    `${esc(c.name)} (${esc(c.shortname)})</option>`
                ).join('');
                fields = `<input type="text" class="form-control smu-builder-input" data-idx="${idx}" data-field="key" ` +
                    `placeholder="${esc(strings.paramqueryname || 'Parameter name')}" value="${esc(row.key)}"${dis}>` +
                    `<select class="form-select smu-builder-select" data-idx="${idx}" data-field="varName"${dis}>` +
                    `<option value="">${esc(strings.paramchoose || 'Choose variable...')}</option>${opts}` +
                    `<option value="__static__"${row.varName === '__static__' ? ' selected' : ''}>` +
                    `${esc(strings.paramstatic || 'Custom fixed value')}</option></select>`;
                if (row.varName === '__static__') {
                    fields += `<input type="text" class="form-control smu-builder-input" data-idx="${idx}" ` +
                        `data-field="value" placeholder="${esc(strings.paramstatic || 'Fixed value')}" ` +
                        `value="${esc(row.value)}"${dis}>`;
                }
            } else {
                const opts = groups.map(([g, list]) =>
                    `<optgroup label="${esc(g)}">` +
                    list.map((mt) =>
                        `<option value="${esc(mt.shortname)}"${row.key === mt.shortname ? ' selected' : ''}>` +
                        `${esc(mt.name)}</option>`
                    ).join('') +
                    `</optgroup>`
                ).join('');
                fields = `<select class="form-select smu-builder-select" data-idx="${idx}" data-field="key"${dis}>` +
                    `<option value="">${esc(strings.choose || 'Choose...')}</option>${opts}` +
                    `<option value="__custom__"${row.key === '__custom__' ? ' selected' : ''}>` +
                    `${esc(strings.customkey || 'Custom key...')}</option></select>`;
                if (row.key === '__custom__') {
                    fields += `<input type="text" class="form-control smu-builder-input" data-idx="${idx}" ` +
                        `data-field="customKey" placeholder="${esc(strings.customkey || 'custom_key')}" ` +
                        `value="${esc(row.customKey)}"${dis}>`;
                }
                fields += `<input type="text" class="form-control smu-builder-input smu-builder-val" data-idx="${idx}" ` +
                    `data-field="value" placeholder="Enter value..." value="${esc(row.value)}"${dis}>`;
            }

            return `<div class="smu-builder-row">${fields}` +
                `<div class="smu-row-actions">` +
                `<button type="button" class="btn btn-outline-secondary smu-iconpill tone-primary" data-add="${idx}" ` +
                `title="${esc(strings.addrow || 'Add row')}"${dis}><i class="fa fa-plus" aria-hidden="true"></i></button>` +
                `<button type="button" class="btn btn-outline-secondary smu-iconpill tone-danger" data-del="${idx}" ` +
                `title="${esc(strings.removerow || 'Remove row')}"${dis}><i class="fa fa-trash" aria-hidden="true"></i></button>` +
                `</div></div>`;
        }).join('');

        html += `<div class="smu-builder-rows">${rowsHtml}</div>`;
        if (kind === 'params') {
            html += `<div class="smu-live-preview" data-region="preview" hidden>` +
                `<span class="smu-live-preview-label">${esc(strings.previewlabel || 'Resolved URL preview:')}</span>` +
                `<code></code></div>`;
        }
        root.innerHTML = html;
        syncHidden();
        updatePreviewDom();
    };

    render();

    if (kind === 'params' && urlInput) {
        urlInput.addEventListener('input', updatePreviewDom);
    }

    root.addEventListener('input', (e) => {
        const el = e.target.closest('[data-idx][data-field]');
        if (!el) {
            return;
        }
        const idx = Number(el.dataset.idx);
        const field = el.dataset.field;
        if (rows[idx]) {
            rows[idx][field] = el.value;
            syncHidden();
            updatePreviewDom();
        }
    });

    root.addEventListener('change', (e) => {
        const el = e.target.closest('select[data-idx][data-field]');
        if (!el) {
            return;
        }
        const idx = Number(el.dataset.idx);
        const field = el.dataset.field;
        if (!rows[idx]) {
            return;
        }
        rows[idx][field] = el.value;
        if (kind === 'params' && field === 'varName' && !rows[idx].key) {
            const match = catalog.find((c) => c.shortname === el.value);
            if (match && match.default_query_param) {
                rows[idx].key = match.default_query_param;
            }
        }
        render();
    });

    root.addEventListener('click', (e) => {
        if (locked) {
            return;
        }
        const tok = e.target.closest('[data-token]');
        if (tok && urlInput) {
            const token = `{{${tok.dataset.token}}}`;
            const start = urlInput.selectionStart ?? urlInput.value.length;
            const end = urlInput.selectionEnd ?? urlInput.value.length;
            urlInput.value = `${urlInput.value.slice(0, start)}${token}${urlInput.value.slice(end)}`;
            urlInput.focus();
            updatePreviewDom();
            return;
        }
        const addBtn = e.target.closest('[data-add]');
        if (addBtn) {
            const idx = Number(addBtn.dataset.add);
            rows.splice(idx + 1, 0, emptyRow());
            render();
            return;
        }
        const delBtn = e.target.closest('[data-del]');
        if (delBtn) {
            const idx = Number(delBtn.dataset.del);
            rows = rows.length <= 1 ? [emptyRow()] : rows.filter((_, i) => i !== idx);
            render();
        }
    });
};
