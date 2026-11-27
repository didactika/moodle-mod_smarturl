/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/lib/schemaModal
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {requireAsync} from '@moodle/lms/core/amd';
import {installSelectMenus} from './selectMenus';

interface ModalForm {
    events: {FORM_SUBMITTED: string; LOADED: string};
    addEventListener: (event: string, handler: (event: Event) => void) => void;
    modal: {getRoot: () => {0: HTMLElement; on: (event: string, listener: () => void) => void}};
    show: () => Promise<void>;
}

interface Options {
    formClass: string;
    args: Record<string, string | number | boolean>;
    modalConfig: {title: string; large: boolean};
    saveButtonText: string;
    saveButtonClasses?: string;
    returnFocus: HTMLElement;
}

/**
 * Opens a site schema form and reports the returned catalogue rows.
 *
 * @param options Moodle modal form options.
 * @param update Receives the result of saving.
 * @param failed Reports a loading error.
 */
export const openSchemaModal = <T>(options: Options, update: (rows: T) => void, failed: (message: string) => void) => {
    void requireAsync<new (config: Options) => ModalForm>('core_form/modalform').then(Modal => {
        const form = new Modal(options);
        form.addEventListener(form.events.LOADED, () => {
            const clickMenu = installSelectMenus(form.modal.getRoot()[0]);
            form.modal.getRoot().on('modal:hidden', clickMenu);
        });
        form.addEventListener(form.events.FORM_SUBMITTED, event => update((event as CustomEvent<T>).detail));
        return form.show();
    }).catch((error: Error) => failed(error.message));
};
