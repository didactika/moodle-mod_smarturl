/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/components/common/MoodleModal
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useRef, useState, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {requireAsync} from '@moodle/lms/core/amd';

interface CoreModal {
    getRoot: () => {
        on: (event: string, action: () => void) => void;
        off: (event: string) => void;
        find: (selector: string) => {0?: HTMLElement};
    };
    getBody: () => {0: HTMLElement};
    show: () => void;
    hide: () => void;
    destroy: () => void;
}

interface ModalClass {
    create: (config: {title: string; large?: boolean; removeOnClose: boolean; returnElement?: HTMLElement}) => Promise<CoreModal>;
}

interface Props {
    title: string;
    large?: boolean;
    children: ReactNode;
    footer?: ReactNode;
    onClose: () => void;
}

export default function MoodleModal({title, large, children, footer, onClose}: Props) {
    const [mount, setMount] = useState<{body: HTMLElement; footer: HTMLElement}>();
    const close = useRef(onClose);
    close.current = onClose;
    useEffect(() => {
        let active = true;
        let instance: CoreModal | undefined;
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
        const safe = document.createElement('span');
        safe.textContent = title;
        void requireAsync<ModalClass>('core/modal').then(Modal =>
            Modal.create({title: safe.innerHTML, large, removeOnClose: false, returnElement: opener})).then(modal => {
            if (!active) {
                modal.destroy();
                return;
            }
            instance = modal;
            const root = modal.getRoot();
            root.on('modal:hidden', () => close.current());
            const body = modal.getBody()[0] as HTMLElement;
            const bottom = root.find('.modal-footer')[0] as HTMLElement | undefined;
            const footerNode = bottom ?? document.createElement('div');
            setMount({body, footer: footerNode});
            modal.show();
        }).catch(() => close.current());
        return () => {
            active = false;
            if (instance) {
                instance.getRoot().off('modal:hidden');
                instance.hide();
                instance.destroy();
            }
        };
    }, [title, large]);
    useEffect(() => {
        if (mount) {
            mount.footer.hidden = !footer;
            mount.footer.classList.toggle('d-none', !footer);
        }
    }, [mount, footer]);
    return mount ? <>
        {createPortal(children, mount.body)}
        {footer && createPortal(footer, mount.footer)}
    </> : null;
}
