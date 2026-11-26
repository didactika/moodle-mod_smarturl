/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @module mod_smarturl/admin_config
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Ajax from 'core/ajax';

const ws = (methodname, args) => Ajax.call([{methodname, args}])[0];

/**
 * Mounts the site-wide resource catalogue.
 *
 * @param {string} id Root element ID.
 */
export const init = id => {
    const root = document.getElementById(id);
    const payload = JSON.parse(root.dataset.payload);
    const strings = payload.strings;
    const error = root.querySelector('[data-region="error-banner"]');
    const search = root.querySelector('[data-search]');
    const meta = {
        records: payload.metaTypes,
        form: root.querySelector('[data-form="meta-type"]'),
        table: root.querySelector('[data-region="meta-tbody"]'),
        keys: ['shortname', 'name', 'group_name', 'datatype', 'display_priority', 'enabled'],
        type: 'meta_type',
    };
    const params = {
        records: payload.paramDefs,
        form: root.querySelector('[data-form="param-def"]'),
        table: root.querySelector('[data-region="param-tbody"]'),
        keys: ['shortname', 'name', 'source_type', 'source_key', 'enabled'],
        type: 'param_def',
    };

    const pageSize = 20;
    meta.page = 0;
    params.page = 0;

    const showError = err => {
        error.textContent = err?.message || strings.savefailed;
        error.hidden = false;
    };

    const selectSource = params.form.querySelector('[data-source-options]');
    const source = params.form.elements.source_key;
    const configureSource = () => {
        const options = payload.sourceOptions[params.form.elements.source_type.value];
        source.hidden = Boolean(options);
        source.required = !options;
        selectSource.hidden = !options;
        selectSource.required = Boolean(options);
        selectSource.replaceChildren(new Option(strings.sourcekey, ''));
        if (options) {
            Object.entries(options).forEach(([key, label]) => selectSource.add(new Option(label, key)));
            if (source.value && !(source.value in options)) {
                selectSource.add(new Option(source.value, source.value));
            }
            selectSource.value = source.value;
        }
    };

    const action = (label, classes, callback) => {
        const button = document.createElement('button');
        button.className = 'btn btn-sm ' + classes;
        button.type = 'button';
        button.textContent = label;
        button.addEventListener('click', callback);
        return button;
    };

    const edit = ({form}, record) => {
        Object.entries(record).forEach(([name, value]) => {
            const field = form.elements[name];
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = Boolean(Number(value));
                } else {
                    field.value = value ?? '';
                }
            }
        });
        configureSource();
        form.elements.shortname.focus();
    };

    const render = config => {
        const query = search.value.trim().toLocaleLowerCase();
        const records = config.records.filter(row => [row.name, row.shortname].some(value =>
            value.toLocaleLowerCase().includes(query)));
        config.page = Math.min(config.page, Math.max(0, Math.ceil(records.length / pageSize) - 1));
        const start = config.page * pageSize;
        const pager = config.form.closest('section').querySelector('[data-pager]');
        pager.hidden = records.length <= pageSize;
        pager.querySelector('[data-range]').textContent = (start + 1) + '–' + Math.min(start + pageSize, records.length)
            + ' / ' + records.length;
        pager.querySelector('[data-prev]').disabled = !config.page;
        pager.querySelector('[data-next]').disabled = start + pageSize >= records.length;
        config.table.replaceChildren();
        records.slice(start, start + pageSize).forEach(record => {
            const row = config.table.insertRow();
            config.keys.forEach(key => {
                const cell = row.insertCell();
                cell.textContent = key === 'enabled' ? (Number(record[key]) ? strings.enabled : strings.disabled) : record[key];
            });
            const commands = row.insertCell();
            commands.append(action(strings.edit, 'btn-outline-secondary mr-1', () => edit(config, record)));
            commands.append(action(strings.delete, 'btn-outline-danger', () => {
                if (window.confirm(strings.confirmdelete.replace('{$a}', record.name))) {
                    ws('mod_smarturl_delete_' + config.type, {id: Number(record.id)}).then(() => {
                        config.records = config.records.filter(item => Number(item.id) !== Number(record.id));
                        render(config);
                        return null;
                    }).catch(showError);
                }
            }));
        });
        if (!records.length) {
            const cell = config.table.insertRow().insertCell();
            cell.colSpan = config.keys.length + 1;
            cell.className = 'text-muted text-center';
            cell.textContent = strings.emptyresults;
        }
    };

    const save = config => {
        config.form.addEventListener('submit', event => {
            event.preventDefault();
            error.hidden = true;
            const data = new FormData(config.form);
            const args = {
                id: Number(data.get('id')),
                name: String(data.get('name')),
                shortname: String(data.get('shortname')),
                enabled: config.form.elements.enabled.checked,
            };
            if (config === meta) {
                Object.assign(args, {
                    categoryid: Number(data.get('categoryid')),
                    datatype: String(data.get('datatype')),
                    display_priority: String(data.get('display_priority')),
                    searchable: config.form.elements.searchable.checked,
                    filterable: config.form.elements.filterable.checked,
                });
            } else {
                Object.assign(args, {
                    source_type: String(data.get('source_type')),
                    source_key: String(data.get('source_key')),
                    default_query_param: String(data.get('default_query_param') || ''),
                });
            }
            ws('mod_smarturl_save_' + config.type, args).then(record => {
                config.records = [...config.records.filter(item => Number(item.id) !== Number(record.id)), record];
                config.form.reset();
                configureSource();
                render(config);
                return null;
            }).catch(showError);
        });
    };

    root.querySelectorAll('[data-action="tab"]').forEach(button => {
        button.addEventListener('click', () => {
            root.querySelectorAll('[data-action="tab"]').forEach(other => {
                const active = other === button;
                other.classList.toggle('is-active', active);
                other.setAttribute('aria-selected', String(active));
            });
            root.querySelectorAll('[data-panel]').forEach(panel => {
                panel.hidden = panel.dataset.panel !== button.dataset.tab;
            });
        });
    });
    params.form.elements.source_type.addEventListener('change', () => {
        source.value = '';
        configureSource();
    });
    selectSource.addEventListener('change', () => {
        source.value = selectSource.value;
    });
    search.addEventListener('input', () => {
        meta.page = 0;
        params.page = 0;
        render(meta);
        render(params);
    });

    const preview = root.querySelector('[data-form="preview"]');
    preview.addEventListener('submit', event => {
        event.preventDefault();
        const fields = new FormData(preview);
        const output = root.querySelector('[data-region="preview-out"]');
        ws('mod_smarturl_preview_url', {
            template: String(fields.get('template')),
            bindings: fields.get('bind_param') ? [{
                param: String(fields.get('bind_param')),
                mode: 'static',
                var: '',
                value: String(fields.get('bind_val')),
            }] : [],
        }).then(result => {
            output.querySelector('code').textContent = result.resolved;
            output.hidden = false;
            return null;
        }).catch(showError);
    });

    [meta, params].forEach(config => {
        const pager = config.form.closest('section').querySelector('[data-pager]');
        pager.querySelector('[data-prev]').addEventListener('click', () => {
            config.page--;
            render(config);
        });
        pager.querySelector('[data-next]').addEventListener('click', () => {
            config.page++;
            render(config);
        });
        save(config);
        render(config);
    });
    configureSource();
};
