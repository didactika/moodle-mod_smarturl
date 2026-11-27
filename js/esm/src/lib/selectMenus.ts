/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/lib/selectMenus
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Adds the Didactika select menu to a plugin form. The original Moodle control
 * retains its label, validation, value and change events.
 *
 * @param root Form or component which owns the controls.
 * @returns The cleanup callback.
 */
export const installSelectMenus = (root: HTMLElement) => {
    let menu: HTMLElement | undefined;
    let control: HTMLSelectElement | undefined;
    let entries: HTMLButtonElement[] = [];
    let search: HTMLInputElement | undefined;
    const close = (focus = false) => {
        menu?.remove();
        control?.removeAttribute('aria-expanded');
        control?.removeAttribute('aria-controls');
        if (focus) {
            control?.focus();
        }
        control = undefined;
        menu = undefined;
        entries = [];
        search = undefined;
    };
    const place = () => {
        if (!menu || !control?.isConnected || !control.getClientRects().length) {
            close();
            return;
        }
        const box = control.getBoundingClientRect();
        const parent = menu.offsetParent;
        const origin = parent instanceof HTMLElement ? parent.getBoundingClientRect() : {left: 0, top: 0};
        menu.style.minWidth = Math.min(box.width, window.innerWidth - 16) + 'px';
        menu.style.left = Math.max(8 - origin.left, Math.min(box.left, window.innerWidth - menu.offsetWidth - 8) - origin.left) + 'px';
        const above = window.innerHeight - box.bottom < menu.offsetHeight && box.top > window.innerHeight - box.bottom;
        menu.style.top = (above ? box.top - menu.offsetHeight - 2 : box.bottom + 2) - origin.top + 'px';
    };
    const keyboard = (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.key === 'Tab') {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
            }
            close(true);
            return;
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            if (event.target !== search && event.key.length === 1 && /\S/.test(event.key) && event.key !== ' ') {
                const visible = entries.filter(item => !item.disabled && !item.hidden);
                const index = visible.indexOf(document.activeElement as HTMLButtonElement) + 1;
                const match = [...visible.slice(index), ...visible.slice(0, index)].find(item =>
                    item.textContent?.trim().toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
                if (match) {
                    event.preventDefault();
                    match.focus();
                }
            }
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const visible = entries.filter(entry => !entry.disabled && !entry.hidden);
        const index = visible.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? visible.length - 1 :
            (index + (event.key === 'ArrowUp' ? -1 : 1) + visible.length) % visible.length;
        visible[next]?.focus();
    };
    const open = (select: HTMLSelectElement) => {
        if (select === control) {
            close(true);
            return;
        }
        close();
        control = select;
        menu = document.createElement('div');
        menu.className = 'dropdown-menu show smu-select-menu';
        menu.id = 'smu-select-menu-' + (select.id || Math.random().toString(36).slice(2));
        menu.dataset.region = 'select-menu';
        menu.setAttribute('role', 'group');
        menu.setAttribute('aria-label', select.labels?.[0]?.textContent?.trim() ?? select.getAttribute('aria-label') ?? '');
        const label = select.getAttribute('data-search-label') || (document.documentElement.lang.startsWith('es')
            ? 'Buscar opciones' : 'Search options');
        const options = [...select.options].filter(option => !option.hidden);
        if (options.length > 10) {
            search = document.createElement('input');
            search.type = 'search';
            search.className = 'form-control form-control-sm rounded-pill';
            search.setAttribute('aria-label', label ?? select.getAttribute('aria-label') ?? select.labels?.[0]?.textContent?.trim() ?? '');
            if (label) {
                search.placeholder = label;
            }
            const searchBox = document.createElement('div');
            searchBox.className = 'smu-menu-search';
            searchBox.append(search);
            menu.append(searchBox);
        }
        const list = document.createElement('div');
        list.setAttribute('role', 'listbox');
        list.className = 'smu-menu-options';
        list.setAttribute('aria-label', menu.getAttribute('aria-label') ?? '');
        let group: string | undefined;
        options.forEach(option => {
            const parent = option.parentElement;
            if (parent instanceof HTMLOptGroupElement && group !== parent.label) {
                group = parent.label;
                const header = document.createElement('div');
                header.className = 'dropdown-header';
                header.textContent = parent.label;
                list.append(header);
            }
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'dropdown-item';
            button.disabled = option.disabled || (parent instanceof HTMLOptGroupElement && parent.disabled);

            button.setAttribute('role', 'option');
            button.setAttribute('aria-selected', String(option.selected));
            const text = document.createElement('span');
            text.textContent = option.textContent;
            button.append(text);
            if (option.selected) {
                const marker = document.createElement('i');
                marker.className = 'fa fa-check';
                marker.setAttribute('aria-hidden', 'true');
                button.append(marker);
            }
            button.addEventListener('click', () => {
                const changed = select.selectedIndex !== option.index;
                close(true);
                if (changed) {
                    select.selectedIndex = option.index;
                    select.dispatchEvent(new Event('input', {bubbles: true}));
                    select.dispatchEvent(new Event('change', {bubbles: true}));
                }
            });
            entries.push(button);
            list.append(button);
        });
        const empty = document.createElement('div');
        empty.className = 'px-3 py-2 text-body-secondary';
        empty.hidden = true;
        empty.textContent = select.getAttribute('data-noresults') || (document.documentElement.lang.startsWith('es')
            ? 'No hay opciones que coincidan' : 'No matching options');
        search?.addEventListener('input', () => {
            const fold = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
            const words = fold(search?.value.trim() ?? '').split(/\s+/);
            entries.forEach(entry => {
                entry.hidden = !words.every(word => fold(entry.textContent ?? '').includes(word));
            });
            list.querySelectorAll('.dropdown-header').forEach(header => {
                if (!(header instanceof HTMLElement)) {
                    return;
                }
                let option = header.nextElementSibling;
                let found = false;
                while (option instanceof HTMLElement && !option.classList.contains('dropdown-header')) {
                    found ||= !option.hidden;
                    option = option.nextElementSibling;
                }
                header.hidden = !found;
            });
            empty.hidden = entries.some(entry => !entry.hidden);
            place();
        });
        menu.append(list, empty);
        (select.closest('.modal') ?? document.body).append(menu);
        select.setAttribute('aria-expanded', 'true');
        select.setAttribute('aria-controls', menu.id);
        search?.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                entries.find(entry => !entry.hidden && !entry.disabled)?.click();
            }
        });
        menu.addEventListener('keydown', keyboard);
        place();
        (search ?? entries.find(entry => entry.getAttribute('aria-selected') === 'true' && !entry.disabled)
            ?? entries.find(entry => !entry.disabled) ?? menu).focus();
    };
    const trigger = (event: MouseEvent | KeyboardEvent) => {
        const select = event.target;
        if (!(select instanceof HTMLSelectElement) || select.disabled || select.multiple
            || select.size > 1 || select.matches('[data-native-select], [data-fieldtype="autocomplete"] select')) {
            return;
        }
        if (event instanceof KeyboardEvent && !['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
            return;
        }
        event.preventDefault();
        open(select);
    };
    const outside = (event: PointerEvent) => {
        if (menu && event.target instanceof Node && !menu.contains(event.target) && event.target !== control) {
            close();
        }
    };
    const scroll = (event: Event) => {
        if (menu && (!(event.target instanceof Node) || !menu.contains(event.target))) {
            place();
        }
    };
    root.addEventListener('mousedown', trigger);
    root.addEventListener('keydown', trigger);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', place);
    return () => {
        close();
        root.removeEventListener('mousedown', trigger);
        root.removeEventListener('keydown', trigger);
        document.removeEventListener('pointerdown', outside);
        document.removeEventListener('scroll', scroll, true);
        window.removeEventListener('resize', place);
    };
};

/**
 * Adds the dropdown only to the controls owned by Smart URL on the admin page.
 *
 * @returns The form listener cleanup.
 */
export const installSettingsMenus = () => {
    const controls = document.querySelectorAll<HTMLElement>('select[name^="s_mod_smarturl"], select[id^="id_s_mod_smarturl"]');
    const clean = [...controls].map(installSelectMenus);
    return () => clean.forEach(remove => remove());
};
