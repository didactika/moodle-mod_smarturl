/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/admin_config
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import ModalForm from 'core_form/modalform';
import ModalEvents from 'core/modal_events';
import {installSelectMenus} from './select_menus';

/**
 * Mounts the catalogue tables and Moodle modal forms.
 *
 * @param {string} id Container ID.
 */
export const init = id => {
    const root = document.getElementById(id);
    const data = JSON.parse(root.dataset.payload);
    const t = data.strings;
    const tabs = [...root.querySelectorAll('[data-tab]')];
    const table = root.querySelector('table');
    const search = root.querySelector('[data-search]');
    const status = root.querySelector('[data-status]');
    const pager = root.querySelector('[data-size]');
    const error = root.querySelector('[data-error]');
    const previous = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const add = root.querySelector('[data-add]');
    const empty = root.querySelector('[data-region="empty"]');
    let section = data.sections.find(item => item.key === data.tab);
    let rows = data.rows;
    let page = 0;
    let perPage = 12;
    let query = '';
    let delay;

    const textNode = (tag, text, classes = '') => {
        const node = document.createElement(tag);
        node.textContent = text;
        node.className = classes;
        return node;
    };

    const open = (opener, row, remove = false) => {
        error.hidden = true;
        const titleText = row ? (remove ? t.deletecategoryheading.replace('{$a}', row.name) : t.edit) : section.add;
        const form = new ModalForm({
            formClass: 'mod_smarturl\\form\\schema_item',
            args: {section: section.key, id: row?.id || 0, remove: Number(remove)},
            modalConfig: {title: textNode('span', titleText).innerHTML, large: false},
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
            error.textContent = failure.message;
            error.hidden = false;
            return null;
        });
    };

    const iconButton = (row, icon, label, tone, remove) => {
        const button = textNode('button', '', 'btn btn-outline-secondary smu-iconpill tone-' + tone);
        button.type = 'button';
        button.title = label;
        button.setAttribute('aria-label', label + ' ' + row.name);
        const glyph = textNode('i', '', 'fa fa-' + icon);
        glyph.setAttribute('aria-hidden', 'true');
        button.append(glyph);
        button.addEventListener('click', () => open(button, row, remove));
        return button;
    };

    const render = () => {
        const matching = rows[section.key].filter(row => (!status.value || row.enabled === (status.value === 'active'))
            && [row.name, row.detail, ...row.columns].some(value => value.toLocaleLowerCase().includes(query)));
        const count = matching.length;
        const sizes = [12, 24, 48, 96].filter(size => size < count);
        if (count <= 500) {
            sizes.push(0);
        }
        const size = sizes.includes(perPage) ? perPage : sizes.at(-1);
        const span = size || Math.max(1, count);
        page = Math.min(page, Math.max(0, Math.ceil(count / span) - 1));
        const offset = page * span;
        pager.replaceChildren(...sizes.map(number => new Option(number || t.all, number)));
        pager.value = String(size);
        previous.disabled = !offset;
        next.disabled = offset + span >= count;
        root.querySelector('[data-range]').textContent = t.pagerange.replace('{$a->from}', count ? offset + 1 : 0)
            .replace('{$a->to}', Math.min(offset + span, count)).replace('{$a->total}', count);
        root.querySelector('[data-clear-status]').hidden = !status.value;
        add.querySelector('span').textContent = section.add;
        table.caption.textContent = section.title;
        const heading = document.createElement('tr');
        [t.name, ...section.columns, t.status, t.actions].forEach((title, index, titles) => {
            const th = textNode('th', '', index >= titles.length - 2 ? 'smu-fit' : '');
            th.scope = 'col';
            th.append(textNode('span', title, index === titles.length - 1 ? 'visually-hidden' : ''));
            heading.append(th);
        });
        table.tHead.replaceChildren(heading);
        const body = table.tBodies[0];
        body.replaceChildren();
        matching.slice(offset, offset + span).forEach(record => {
            const row = body.insertRow();
            const name = textNode('th', '');
            name.scope = 'row';
            const link = textNode('a', record.name);
            link.href = '#item-' + record.id;
            link.addEventListener('click', event => {
                event.preventDefault();
                open(link, record);
            });
            name.append(link);
            if (record.detail) {
                const description = textNode('div', '', 'small text-body-secondary');
                description.append(textNode('code', record.detail));
                name.append(description);
            }
            row.append(name);
            record.columns.forEach(value => {
                row.insertCell().textContent = value;
            });
            row.insertCell().append(textNode('span', record.enabled ? t.enabled : t.disabled,
                'badge rounded-pill smu-state' + (record.enabled ? ' smu-state-on' : '')));
            const actions = textNode('div', '', 'smu-row-actions');
            actions.append(
                iconButton(record, 'pen', t.edit, 'primary', false),
                iconButton(record, 'trash', t.delete, 'danger', true)
            );
            row.insertCell().append(actions);
        });
        const narrowed = Boolean(query || status.value);
        empty.hidden = count > 0;
        empty.querySelector('p').textContent = narrowed ? t.emptyresults : t.listempty;
        empty.querySelector('button').textContent = narrowed ? t.clearfilters : section.add;
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
    };

    const clear = () => {
        clearTimeout(delay);
        search.value = '';
        query = '';
        status.value = '';
        page = 0;
        render();
    };
    tabs.forEach(tab => tab.addEventListener('click', event => {
        if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            section = data.sections.find(item => item.key === tab.dataset.tab);
            clear();
            window.history.replaceState(null, '', tab.href);
        }
    }));
    search.addEventListener('input', () => {
        clearTimeout(delay);
        delay = setTimeout(() => {
            query = search.value.trim().toLocaleLowerCase();
            page = 0;
            render();
        }, 400);
    });
    status.addEventListener('change', () => {
        page = 0;
        render();
    });
    pager.addEventListener('change', () => {
        perPage = Number(pager.value);
        page = 0;
        render();
    });
    previous.addEventListener('click', () => { page--; render(); });
    next.addEventListener('click', () => { page++; render(); });
    add.addEventListener('click', () => open(add));
    root.querySelector('[data-clear-status]').addEventListener('click', () => {
        status.value = '';
        page = 0;
        render();
    });
    const emptyAction = empty.querySelector('button');
    emptyAction.addEventListener('click', () => {
        if (query || status.value) {
            clear();
        } else {
            open(emptyAction);
        }
    });
    installSelectMenus(root);
    render();
};
