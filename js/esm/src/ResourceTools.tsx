/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useRef} from 'react';
import {requireAsync} from '@moodle/lms/core/amd';

interface CoreModal {
    create: (options: {title?: string; removeOnClose: boolean; returnElement: HTMLElement; scrollable: boolean}) => Promise<{
        getBody: () => {0: HTMLElement};
        getRoot: () => {find: (selector: string) => {addClass: (name: string) => void}};
        show: () => void;
    }>;
}
const loadModal = () => requireAsync<CoreModal>('core/modal');

const install = (root: Element) => {
    const trigger = root.querySelector('[data-smarturl-details]');
    const button = trigger instanceof HTMLElement ? trigger : null;
    const source = root.querySelector('template');
    const slot = root.querySelector('[data-smarturl-completion-slot]');
    const grid = slot?.closest('.activity-grid');
    const show = async (opener: HTMLElement, title: string, content: Node) => {
        const Modal = await loadModal();
        const dialog = await Modal.create({title, removeOnClose: true, returnElement: opener, scrollable: true});
        const body = dialog.getBody()[0];
        body.replaceChildren(content);
        body.closest('.modal-dialog')?.classList.add('smu-resource-modal');
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
            const label = (toggle.textContent ?? '').trim();
            toggle.setAttribute('aria-label', label);
            toggle.title = label;
            toggle.classList.add('smu-course-completion-button');
            const icon = document.createElement('i');
            icon.className = 'fa fa-list-check';
            icon.setAttribute('aria-hidden', 'true');
            const text = document.createElement('span');
            text.textContent = label;
            toggle.replaceChildren(icon, text);
            const content = completion.querySelector('[data-for="dropdowndialog_content"]');
            if (content) {
                toggle.classList.remove('dropdown-toggle');
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

export default function ResourceTools() {
    const marker = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const root = marker.current?.parentElement?.previousElementSibling;
        return root?.matches('[data-smarturl-tools]') ? install(root) : undefined;
    }, []);
    return <span ref={marker} hidden/>;
}
