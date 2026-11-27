/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @module mod_smarturl/appearance_preview
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Modal from 'core/modal';
import ModalEvents from 'core/modal_events';
import {installSelectMenus} from './select_menus';

/**
 * Mounts the appearance controls.
 *
 * @param {string} id Widget ID.
 */
export const init = (id) => {
    const root = document.getElementById(id);
    const editor = root?.closest('form');
    if (!editor) {
        return;
    }
    const catalogue = editor.elements.smu_catalogue;
    catalogue?.addEventListener('change', () => {
        if (catalogue.value) {
            const link = editor.elements.externalurl;
            link.value = catalogue.value;
            link.dispatchEvent(new Event('input', {bubbles: true}));
            if (!editor.elements.name.value) {
                editor.elements.name.value = catalogue.selectedOptions[0]?.textContent?.trim() || '';
            }
        }
    });
    const field = name => editor.querySelector('[name="' + name + '"]');
    const refreshControls = () => {
        const course = field('smu_course')?.value;
        const launch = field('smu_launch')?.value || '';
        const useCard = course === 'CARD' || course === 'IMAGE';
        const viewer = field('smu_viewer')?.value || 'AUTO';
        const href = field('externalurl')?.value || '';
        const media = /(?:youtube\.com|youtu\.be|vimeo\.com|\.(?:mp4|webm|mp3|wav|ogg)(?:[?#]|$))/i.test(href);
        const showCover = useCard || (!launch.startsWith('EXTERNAL') && (viewer !== 'AUTO' || !media) && viewer !== 'EMBED');
        const popup = ['VIEWERWINDOW', 'EXTERNALWINDOW'].includes(launch);
        ['popup_width', 'popup_height'].forEach(name => field(name)?.closest('.fitem')?.classList.toggle('d-none', !popup));
        ['smu_poster', 'thumbnail_url', 'poster_filemanager'].forEach(name => {
            field(name)?.closest('.fitem')?.classList.toggle('d-none', !showCover);
        });
        field('smu_play')?.closest('.fitem')?.classList.toggle('d-none', !useCard || !media);
    };
    editor.addEventListener('change', refreshControls);
    editor.addEventListener('input', refreshControls);
    refreshControls();
    const trigger = root.querySelector('[data-open]');
    installSelectMenus(editor);
    const refresh = (frame, surface, language) => {
        window.tinymce?.triggerSave();
        const draft = {};
        for (const [name, value] of new FormData(editor)) {
            if (name.startsWith('smu_') && name.endsWith('[]')) {
                const key = name.slice(0, -2);
                draft[key] = [...(draft[key] || []), value];
            } else if (name.startsWith('smu_') || ['name', 'externalurl', 'parameters_json', 'metadata_json',
                'thumbnail_url', 'poster_filemanager', 'aspect_ratio', 'introeditor[text]', 'introeditor[format]'].includes(name)) {
                draft[name] = value;
            }
        }
        const form = document.createElement('form');
        form.method = 'post';
        form.action = root.dataset.url;
        form.target = frame.name;
        form.hidden = true;
        const values = {draft: JSON.stringify(draft), surface: surface.value, language: language.value,
            sesskey: root.dataset.sesskey, courseid: root.dataset.courseid, cmid: root.dataset.cmid};
        for (const [key, value] of Object.entries(values)) {
            const field = document.createElement('input');
            field.type = 'hidden';
            field.name = key;
            field.value = value;
            form.append(field);
        }
        document.body.append(form);
        form.submit();
        form.remove();
    };

    trigger.addEventListener('click', async() => {
        const content = root.querySelector('template').content.cloneNode(true);
        const modal = await Modal.create({title: trigger.textContent.trim(), large: true, removeOnClose: true,
            returnElement: trigger});
        const body = modal.getBody()[0];
        body.replaceChildren(content);
        const clear = installSelectMenus(body);
        const frame = body.querySelector('iframe');
        const surface = body.querySelector('[data-surface]');
        const language = body.querySelector('[data-language]');
        const update = () => refresh(frame, surface, language);
        surface.addEventListener('change', update);
        language.addEventListener('change', update);
        body.querySelector('[data-mobile]').addEventListener('change', ({target}) =>
            frame.classList.toggle('smu-preview-mobile', target.checked));
        modal.getRoot().on(ModalEvents.hidden, clear);
        modal.getRoot().find('.modal-footer').addClass('d-none');
        modal.show();
        update();
    });
};
