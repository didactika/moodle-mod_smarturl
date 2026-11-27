/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Modal from 'core/modal';

const loadModal = () => Promise.resolve(Modal);

/**
 * Mounts the resource information button and moves the core completion control.
 *
 * @param {string} id Unique region ID.
 */
export const init = id => {
    const root = document.getElementById(id);
    if (!root) {
        return () => {};
    }
    const trigger = root.querySelector('[data-smarturl-details]');
    const button = trigger instanceof HTMLElement ? trigger : null;
    const source = root.querySelector('template');
    const slot = root.querySelector('[data-smarturl-completion-slot]');
    const grid = slot?.closest('.activity-grid');
    const show = async (opener, title, content) => {
        const Modal = await loadModal();
        const dialog = await Modal.create({title, removeOnClose: true, returnElement: opener});
        dialog.getBody()[0].replaceChildren(content);
        dialog.getRoot().find('.modal-dialog').addClass('smu-fixed-modal');
        dialog.getRoot().find('.modal-footer').addClass('d-none');
        dialog.show();
    };
    const relocate = () => {
        const completion = grid?.querySelector(':scope > .activity-completion');
        if (!slot || !completion) {
            return;
        }
        const toggle = completion.querySelector('button[data-for="dropdowndialog_button"]');
        if (toggle instanceof HTMLButtonElement) {
            const label = toggle.textContent.trim();
            toggle.setAttribute('aria-label', label);
            toggle.title = label;
            toggle.classList.add('smu-iconpill', 'smu-course-completion-button');
            const icon = document.createElement('i');
            icon.className = 'fa fa-list-check';
            icon.setAttribute('aria-hidden', 'true');
            const text = document.createElement('span');
            text.textContent = label;
            toggle.replaceChildren(icon, text);
            const content = completion.querySelector('[data-for="dropdowndialog_content"]');
            if (content) {
                toggle.removeAttribute('data-toggle');
                toggle.removeAttribute('data-bs-toggle');
                toggle.removeAttribute('aria-expanded');
                toggle.setAttribute('aria-haspopup', 'dialog');
                toggle.addEventListener('click', () => {
                    const copy = content.cloneNode(true);
                    if (copy instanceof HTMLElement) {
                        copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
                        void show(toggle, label, copy).catch(() => {});
                    }
                });
            }
        }
        slot.append(completion);
    };
    relocate();
    const observer = grid ? new MutationObserver(relocate) : null;
    if (grid && observer) {
        observer.observe(grid, {childList: true});
    }
    if (!button || !source) {
        return () => observer?.disconnect();
    }
    const click = () => void show(button, button.dataset.title || '', source.content.cloneNode(true)).catch(() => {});
    button.addEventListener('click', click);
    return () => {
        observer?.disconnect();
        button.removeEventListener('click', click);
    };
};
