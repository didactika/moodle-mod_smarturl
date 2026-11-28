/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/admin_config
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import ModalForm from 'core_form/modalform';
import ModalEvents from 'core/modal_events';
import Templates from 'core/templates';
import {installSelectMenus} from './select_menus';

const PAGE_SIZES = [12, 24, 48, 96];
const SKELETON_ROWS = 8;
const SKELETON_DELAY = 150;

/**
 * Mounts the catalogue: the tabs of its sections, the status chips, the search, the table, its empty state, the pager and the
 * Moodle modal forms that add, edit and delete an item. The tab, the search, the status and the page are kept in the address.
 *
 * @param {string} id Container ID.
 */
export const init = id => {
    const root = document.getElementById(id);
    const data = JSON.parse(root.dataset.payload);
    const t = data.strings;
    const region = name => root.querySelector(`[data-region="${name}"]`);
    const action = name => root.querySelector(`[data-action="${name}"]`);
    const tabs = [...root.querySelectorAll('[data-tab]')];
    /** The table of the section on show; its template renders it whole, so it is looked up each time. */
    const table = () => tablewrap.querySelector('table');
    const tablewrap = region('tablewrap');
    const search = region('search');
    const chips = [...root.querySelectorAll('[data-region="chips"] [data-status]')];
    const perpage = region('perpage');
    const error = region('error');
    const empty = region('empty');
    const foot = region('foot');
    const previous = action('prev');
    const next = action('next');
    const params = new URLSearchParams(window.location.search);
    let section = data.sections.find(item => item.key === data.tab) ?? data.sections[0];
    let rows = data.rows;
    let query = (params.get('q') ?? '').trim();
    let status = ['active', 'inactive'].includes(params.get('status')) ? params.get('status') : '';
    let page = Math.max(0, Number(params.get('page') ?? 1) - 1) || 0;
    let perPage = PAGE_SIZES[0];
    let delay;
    let retry = null;
    let pending = 0;

    search.value = query;

    const remember = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', section.key);
        [['q', query], ['status', status], ['page', page ? String(page + 1) : '']].forEach(([key, value]) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState(null, '', url);
    };

    const showError = (message, again) => {
        region('errormessage').textContent = message;
        error.hidden = false;
        retry = again;
    };

    const open = (opener, row = null, remove = false) => {
        error.hidden = true;
        let title = section.add;
        if (row) {
            title = remove ? t.deletecategoryheading.replace('{$a}', row.name) : t.edit;
        }
        const label = document.createElement('span');
        label.textContent = title;
        const form = new ModalForm({
            formClass: 'mod_smarturl\\form\\schema_item',
            args: {section: section.key, id: row?.id || 0, remove: Number(remove)},
            modalConfig: {title: label.innerHTML, large: false, scrollable: true},
            saveButtonText: remove ? t.delete : t.savechanges,
            saveButtonClasses: remove ? 'btn-danger' : undefined,
            returnFocus: opener,
        });
        form.addEventListener(form.events.LOADED, () => {
            const clear = installSelectMenus(form.modal.getRoot()[0]);
            form.modal.getRoot().on(ModalEvents.hidden, clear);
        });
        form.addEventListener(form.events.FORM_SUBMITTED, event => {
            rows = event.detail;
            render();
        });
        form.show().catch(failure => {
            showError(failure.message, () => open(opener, row, remove));
            return null;
        });
    };

    /**
     * Draws the columns and the header of the section and rows of placeholders, while its rows are rendered, so a new tab never
     * shows the rows of the one before and a filter never shows rows it does not match. The columns are the ones of the rows
     * (mod_smarturl/admin_config_table), so nothing moves when they arrive. The pager waits for the rows.
     */
    const skeleton = () => {
        const columns = document.createElement('colgroup');
        ['name', ...section.columns.map(() => ''), 'status', 'actions'].forEach(name => {
            const column = document.createElement('col');
            if (name) {
                column.dataset.column = name;
            }
            columns.append(column);
        });
        const detailed = rows[section.key].some(row => row.detail);
        const head = document.createElement('tr');
        [t.name, ...section.columns, t.status, ''].forEach((title, index, titles) => {
            const cell = document.createElement('th');
            cell.scope = 'col';
            cell.textContent = title;
            if (index === titles.length - 1) {
                cell.className = 'text-end text-right';
                cell.dataset.column = 'actions';
            }
            head.append(cell);
        });
        const body = document.createElement('tbody');
        for (let row = 0; row < SKELETON_ROWS; row++) {
            const line = body.insertRow();
            line.setAttribute('aria-hidden', 'true');
            [['w-75', detailed ? 'w-50' : ''], ...section.columns.map(() => ['w-75']), ['w-50']].forEach(widths => {
                const cell = line.insertCell();
                widths.filter(Boolean).forEach(width => {
                    const bar = document.createElement('span');
                    bar.className = 'placeholder ' + width;
                    cell.append(bar);
                });
            });
            // The two actions of a row, as circles of the size of their buttons.
            const actions = line.insertCell();
            actions.className = 'text-end text-right';
            actions.dataset.column = 'actions';
            actions.append(document.createElement('span'), document.createElement('span'));
            [...actions.children].forEach(circle => {
                circle.className = 'placeholder';
            });
        }
        const thead = document.createElement('thead');
        thead.append(head);
        table().replaceChildren(columns, thead, body);
        tablewrap.hidden = false;
        empty.hidden = true;
        foot.hidden = true;
    };

    const render = async(fresh = false) => {
        const ticket = ++pending;
        // A new section shows its placeholders at once; a search, a filter or a page shows them only when its rows are slow.
        let slow = null;
        if (fresh) {
            skeleton();
        } else {
            slow = setTimeout(() => {
                if (ticket === pending) {
                    skeleton();
                }
            }, SKELETON_DELAY);
        }
        const narrowed = Boolean(query || status);
        const needle = query.toLocaleLowerCase();
        // The chips count what the search leaves, so a chip never promises rows that are not there.
        const found = rows[section.key].filter(row => [row.name, row.detail, ...row.columns]
            .some(value => String(value).toLocaleLowerCase().includes(needle)));
        const matching = found.filter(row => !status || row.enabled === (status === 'active'));
        const count = matching.length;
        const sizes = PAGE_SIZES.filter(size => size < count);
        if (count <= 500) {
            sizes.push(0);
        }
        const size = sizes.includes(perPage) ? perPage : sizes.at(-1);
        const span = size || Math.max(1, count);
        page = Math.min(page, Math.max(0, Math.ceil(count / span) - 1));
        const offset = page * span;

        // The chips and the toolbar say what narrows the list and offer to undo it.
        chips.forEach(chip => {
            const chosen = chip.dataset.status === status;
            chip.classList.toggle('active', chosen);
            chip.setAttribute('aria-pressed', String(chosen));
            chip.querySelector('[data-count]').textContent = found
                .filter(row => !chip.dataset.status || row.enabled === (chip.dataset.status === 'active')).length;
        });
        action('clear-search').hidden = !search.value;
        action('clearfilters').disabled = !narrowed;
        region('addlabel').textContent = section.add;

        // The pager.
        perpage.replaceChildren(...sizes.map(number => new Option(number || t.all, number)));
        perpage.value = String(size);
        previous.disabled = !offset;
        next.disabled = offset + span >= count;
        region('range').textContent = t.pagerange.replace('{$a->from}', count ? offset + 1 : 0)
            .replace('{$a->to}', Math.min(offset + span, count)).replace('{$a->total}', count);

        tabs.forEach(tab => {
            const current = section.key === tab.dataset.tab;
            tab.querySelector('[data-count]').textContent = rows[tab.dataset.tab].length;
            tab.classList.toggle('active', current);
            if (current) {
                tab.setAttribute('aria-current', 'page');
            } else {
                tab.removeAttribute('aria-current');
            }
        });
        remember();

        tablewrap.setAttribute('aria-busy', 'true');
        const [list, blank] = await Promise.all([
            Templates.renderForPromise('mod_smarturl/admin_config_table', {
                caption: section.title,
                namelabel: t.name,
                statuslabel: t.status,
                actionslabel: t.actions,
                columns: section.columns,
                rows: matching.slice(offset, offset + span).map(row => ({
                    id: row.id,
                    name: row.name,
                    detail: row.detail,
                    cells: row.columns,
                    enabled: row.enabled,
                    status: row.enabled ? t.enabled : t.disabled,
                    editlabel: `${t.edit} ${row.name}`,
                    deletelabel: `${t.delete} ${row.name}`,
                })),
            }),
            count ? null : Templates.renderForPromise('mod_smarturl/admin_config_empty', {
                filtered: narrowed,
                icon: section.icon,
                title: narrowed ? t.emptyresults : section.emptytitle,
                text: narrowed ? t.emptyresultstext : section.emptytext,
                action: section.add,
                clearfilters: t.clearfilters,
            }),
        ]);
        clearTimeout(slow);
        if (ticket !== pending) {
            return;
        }
        Templates.replaceNodeContents(tablewrap, list.html, list.js);
        if (blank) {
            Templates.replaceNodeContents(empty, blank.html, blank.js);
        }
        tablewrap.removeAttribute('aria-busy');
        tablewrap.hidden = !count;
        foot.hidden = !count;
        empty.hidden = Boolean(count);
    };

    const clearFilters = (fresh = false) => {
        clearTimeout(delay);
        search.value = '';
        query = '';
        status = '';
        page = 0;
        render(fresh);
    };

    const rowById = id => rows[section.key].find(row => String(row.id) === String(id));

    tabs.forEach(tab => tab.addEventListener('click', event => {
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            section = data.sections.find(item => item.key === tab.dataset.tab);
            clearFilters(true);
        }
    }));
    search.addEventListener('input', () => {
        action('clear-search').hidden = !search.value;
        clearTimeout(delay);
        delay = setTimeout(() => {
            query = search.value.trim();
            page = 0;
            render();
        }, 300);
    });
    search.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
    action('clear-search').addEventListener('click', () => {
        clearTimeout(delay);
        search.value = '';
        query = '';
        page = 0;
        render();
        search.focus();
    });
    chips.forEach(chip => chip.addEventListener('click', () => {
        status = chip.dataset.status;
        page = 0;
        render();
    }));
    perpage.addEventListener('change', () => {
        perPage = Number(perpage.value);
        page = 0;
        render();
    });
    previous.addEventListener('click', () => {
        page--;
        render();
    });
    next.addEventListener('click', () => {
        page++;
        render();
    });
    action('add').addEventListener('click', event => open(event.currentTarget));
    action('clearfilters').addEventListener('click', () => clearFilters());
    action('retry').addEventListener('click', () => {
        error.hidden = true;
        retry?.();
    });
    tablewrap.addEventListener('click', event => {
        const button = event.target.closest('[data-action="edit"], [data-action="delete"]');
        const row = button ? rowById(button.dataset.id) : null;
        if (row) {
            event.preventDefault();
            open(button, row, button.dataset.action === 'delete');
        }
    });
    empty.addEventListener('click', event => {
        const button = event.target.closest('[data-action]');
        if (button?.dataset.action === 'clearfilters') {
            clearFilters();
        } else if (button?.dataset.action === 'add') {
            open(button);
        }
    });
    installSelectMenus(root);
    render(true);
};
