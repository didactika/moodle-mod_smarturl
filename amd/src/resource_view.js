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
 * Didactika metadata explorer and media stage controller for Moodle 4.5 - 5.2.
 *
 * @module     mod_smarturl/resource_view
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Ajax from 'core/ajax';

const COLLAPSE_THRESHOLD = 18;

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
 * Tracks completion view event via external web service.
 *
 * @param {number} cmid Course module ID.
 */
const trackView = (cmid) => {
    Ajax.call([{
        methodname: 'mod_smarturl_track_view',
        args: {cmid},
    }]);
};

/**
 * Renders formatted metadata value markup based on datatype.
 *
 * @param {Object} item Metadata entry.
 * @returns {string}
 */
const renderValueHtml = (item) => {
    const val = String(item.value ?? '');
    if (item.datatype === 'URL' && /^https?:\/\//i.test(val)) {
        return `<a href="${esc(val)}" target="_blank" rel="noopener noreferrer">${esc(val)}</a>`;
    }
    if (item.datatype === 'TAGS') {
        const parts = val.split(',').map((s) => s.trim()).filter(Boolean);
        return `<div class="dd-tags">${parts.map((p) => `<span class="dd-tag">${esc(p)}</span>`).join('')}</div>`;
    }
    if (item.datatype === 'BADGE') {
        return `<span class="dd-tag dd-tag-primary">${esc(val)}</span>`;
    }
    if (item.datatype === 'BOOLEAN') {
        const truthy = ['1', 'true', 'yes', 'si'].includes(val.toLowerCase());
        return `<span class="dd-tag">${truthy ? 'Yes' : 'No'}</span>`;
    }
    return esc(val);
};

/**
 * Initializes the interactive viewer on a rendered resource_view root element.
 *
 * @param {string} rootId Root container ID.
 */
export const init = (rootId) => {
    const root = document.getElementById(rootId);
    if (!root) {
        return;
    }

    const payload = JSON.parse(root.dataset.payload || '{}');
    const items = Array.isArray(payload.metadata) ? payload.metadata : [];
    const strings = payload.strings || {};

    let activeGroup = 'ALL';
    let searchQuery = '';
    let viewMode = 'cards';
    let showAll = false;

    const chipsHost = root.querySelector('[data-region="group-chips"]');
    const resultsHost = root.querySelector('[data-region="results-host"]');
    const modalBackdrop = root.querySelector('[data-region="modal-backdrop"]');
    const modalIframe = root.querySelector('[data-region="modal-iframe"]');

    if (payload.displayMode === 'EMBED' && payload.cmid) {
        trackView(Number(payload.cmid));
    }

    const groupsMap = {};
    items.forEach((item) => {
        if (item.displaypriority === 'HIDDEN') {
            return;
        }
        const g = item.group || 'General';
        groupsMap[g] = (groupsMap[g] || 0) + 1;
    });
    const groups = Object.keys(groupsMap);

    const renderChips = () => {
        if (!chipsHost) {
            return;
        }
        let html = `<button type="button" class="${activeGroup === 'ALL' ? 'dd-chip-applied' : ''}" data-group="ALL">` +
            `${esc(strings.allgroups || 'All groups')} (${items.length})</button>`;
        groups.forEach((g) => {
            const cls = activeGroup === g ? 'dd-chip-applied' : '';
            html += `<button type="button" class="${cls}" data-group="${esc(g)}">${esc(g)} (${groupsMap[g]})</button>`;
        });
        chipsHost.innerHTML = html;
    };

    const filterItems = () => {
        const needle = searchQuery.trim().toLowerCase();
        return items.filter((item) => {
            if (item.displaypriority === 'HIDDEN') {
                return false;
            }
            if (activeGroup !== 'ALL' && (item.group || 'General') !== activeGroup) {
                return false;
            }
            if (!needle) {
                return true;
            }
            return (
                String(item.label || '').toLowerCase().includes(needle) ||
                String(item.key || '').toLowerCase().includes(needle) ||
                String(item.value || '').toLowerCase().includes(needle) ||
                String(item.group || '').toLowerCase().includes(needle)
            );
        });
    };

    const renderResults = () => {
        if (!resultsHost) {
            return;
        }
        const filtered = filterItems();
        if (filtered.length === 0) {
            resultsHost.innerHTML = `<div class="dd-empty">` +
                `<p class="dd-empty-title">${esc(strings.emptymetadata || 'No metadata')}</p>` +
                `<p class="dd-empty-hint">${esc(strings.emptymetadata_hint || '')}</p>` +
                `</div>`;
            return;
        }

        const slice = (!showAll && !searchQuery.trim() && filtered.length > COLLAPSE_THRESHOLD)
            ? filtered.slice(0, COLLAPSE_THRESHOLD)
            : filtered;

        let html = '';
        if (viewMode === 'table') {
            const rows = slice.map((item) =>
                `<tr><td><code>${esc(item.group || 'General')}</code></td>` +
                `<td><strong>${esc(item.label || item.key)}</strong></td>` +
                `<td>${renderValueHtml(item)}</td></tr>`
            ).join('');
            html = `<div class="smu-table-wrap"><table class="table smu-table"><tbody>${rows}</tbody></table></div>`;
        } else {
            const byGroup = {};
            slice.forEach((item) => {
                const g = item.group || 'General';
                if (!byGroup[g]) {
                    byGroup[g] = [];
                }
                byGroup[g].push(item);
            });
            html = '<div class="smu-cards-grid">' + Object.keys(byGroup).map((g) => {
                const entries = byGroup[g].map((item) =>
                    `<div class="dd-dl-item"><dt>${esc(item.label || item.key)}</dt><dd>${renderValueHtml(item)}</dd></div>`
                ).join('');
                return `<section class="smu-group-card"><h4 class="smu-group-title">${esc(g)}</h4>` +
                    `<dl class="dd-dl smu-dl-card">${entries}</dl></section>`;
            }).join('') + '</div>';
        }

        if (!searchQuery.trim() && filtered.length > COLLAPSE_THRESHOLD) {
            const label = showAll
                ? (strings.showless || 'Show fewer')
                : `${strings.showmore || 'Show all'} (${filtered.length})`;
            html += `<div class="smu-showmore-row">` +
                `<button type="button" class="btn btn-outline-secondary btn-sm" data-action="toggle-more">${esc(label)}</button>` +
                `</div>`;
        }
        resultsHost.innerHTML = html;
    };

    renderChips();
    renderResults();

    root.addEventListener('click', (e) => {
        const groupBtn = e.target.closest('[data-group]');
        if (groupBtn) {
            activeGroup = groupBtn.dataset.group;
            renderChips();
            renderResults();
            return;
        }
        const actionEl = e.target.closest('[data-action]');
        if (!actionEl) {
            return;
        }
        const action = actionEl.dataset.action;
        if (action === 'view-mode') {
            viewMode = actionEl.dataset.mode === 'table' ? 'table' : 'cards';
            root.querySelectorAll('[data-action="view-mode"]').forEach((b) => {
                b.classList.toggle('is-active', b.dataset.mode === viewMode);
            });
            renderResults();
        } else if (action === 'toggle-more') {
            showAll = !showAll;
            renderResults();
        } else if (action === 'copy-json' && navigator.clipboard) {
            navigator.clipboard.writeText(JSON.stringify(items, null, 2));
            actionEl.textContent = strings.copied || 'Copied';
            window.setTimeout(() => {
                actionEl.textContent = strings.copyjson || 'Copy JSON';
            }, 1800);
        } else if (action === 'track-open') {
            trackView(Number(payload.cmid));
        } else if (action === 'launch-inline') {
            const stage = root.querySelector('.smu-stage');
            if (stage) {
                const ratio = String(payload.aspectRatio || '16:9').replace(':', ' / ');
                stage.innerHTML = `<div class="smu-frame-wrap" style="aspect-ratio: ${esc(ratio)};">` +
                    `<iframe src="${esc(payload.resolvedUrl)}" title="${esc(payload.name || '')}" allowfullscreen></iframe>` +
                    `</div>`;
                trackView(Number(payload.cmid));
            }
        } else if (action === 'open-modal' && modalBackdrop && modalIframe) {
            modalIframe.src = payload.resolvedUrl;
            modalBackdrop.hidden = false;
            trackView(Number(payload.cmid));
        } else if (action === 'close-modal' && modalBackdrop && modalIframe) {
            modalBackdrop.hidden = true;
            modalIframe.src = 'about:blank';
        }
    });

    const searchInput = root.querySelector('[data-action="search"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderResults();
        });
    }
};
