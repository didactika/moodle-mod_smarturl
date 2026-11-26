/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

interface PreviewProps {
    url: string;
    courseid: number;
    cmid: number;
    sesskey: string;
    languages: Array<{code: string; name: string}>;
    previewresource: string;
    previewcourse: string;
    previewactivity: string;
    previewauxiliary: string;
    previewmobile: string;
    previewpending: string;
    preset: string;
    preset_video: string;
    preset_document: string;
    preset_weblink: string;
    translationlanguage: string;
    closepreview: string;
}

const presets: Record<string, [string, string, string]> = {
    video: ['CARD', 'VIEWERTAB', 'POSTER'],
    document: ['CARD', 'ACTIVITY', 'EMBED'],
    weblink: ['LINK', 'EXTERNAL', 'LINK'],
};

const AppearancePreview = (props: PreviewProps) => {
    const trigger = useRef<HTMLButtonElement>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    const iframe = useRef<HTMLIFrameElement>(null);
    const id = useId();
    const [open, setOpen] = useState(false);
    const [surface, setSurface] = useState('course');
    const [language, setLanguage] = useState('');
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        if (!open || !dialog.current) {
            return undefined;
        }
        const node = dialog.current;
        node.showModal();
        return () => {
            node.close();
            trigger.current?.focus();
        };
    }, [open]);

    useEffect(() => {
        const editor = trigger.current?.closest('form');
        if (!open || !editor || !iframe.current) {
            return;
        }
        const tiny = (window as Window & {tinymce?: {triggerSave: () => void}}).tinymce;
        tiny?.triggerSave();
        const draft: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
        for (const [name, value] of new FormData(editor)) {
            if (name.startsWith('smu_') && name.endsWith('[]')) {
                const key = name.slice(0, -2);
                draft[key] = [...(Array.isArray(draft[key]) ? draft[key] : []), value];
            } else if (name.startsWith('smu_') || ['name', 'externalurl', 'parameters_json', 'metadata_json', 'thumbnail_url',
                'poster_filemanager', 'aspect_ratio', 'introeditor[text]', 'introeditor[format]'].includes(name)) {
                draft[name] = value;
            }
        }
        const form = document.createElement('form');
        form.method = 'post';
        form.action = props.url;
        form.target = iframe.current.name;
        form.hidden = true;
        const values = {draft: JSON.stringify(draft), surface, language, sesskey: props.sesskey,
            courseid: props.courseid, cmid: props.cmid};
        for (const [key, value] of Object.entries(values)) {
            const field = document.createElement('input');
            field.type = 'hidden';
            field.name = key;
            field.value = String(value);
            form.append(field);
        }
        document.body.append(form);
        form.submit();
        form.remove();
    }, [open, surface, language, props.url, props.courseid, props.cmid, props.sesskey]);

    useEffect(() => {
        const editor = trigger.current?.closest('form');
        const catalogue = editor?.querySelector<HTMLSelectElement>('[name="smu_catalogue"]');
        const link = editor?.querySelector<HTMLInputElement>('[name="externalurl"]');
        if (!catalogue || !link) {
            return undefined;
        }
        const choose = () => {
            if (catalogue.value) {
                link.value = catalogue.value;
                link.dispatchEvent(new Event('input', {bubbles: true}));
                const title = editor?.querySelector<HTMLInputElement>('[name="name"]');
                if (title && !title.value) {
                    title.value = catalogue.selectedOptions[0]?.textContent?.trim() ?? '';
                }
            }
        };
        catalogue.addEventListener('change', choose);
        return () => catalogue.removeEventListener('change', choose);
    }, []);

    useEffect(() => {
        const form = trigger.current?.closest('form');
        if (!form) {
            return undefined;
        }
        const field = (name: string) => form.querySelector<HTMLInputElement | HTMLSelectElement>('[name="' + name + '"]');
        const refresh = () => {
            const course = field('smu_course')?.value;
            const launch = field('smu_launch')?.value ?? '';
            const useCard = course === 'CARD' || course === 'IMAGE';
            const showCover = useCard || (!launch.startsWith('EXTERNAL') && field('smu_viewer')?.value === 'POSTER');
            const href = field('externalurl')?.value ?? '';
            const media = /(?:youtube\.com|youtu\.be|vimeo\.com|\.(?:mp4|webm|mp3|wav|ogg)(?:[?#]|$))/i.test(href);
            ['smu_poster', 'thumbnail_url', 'poster_filemanager'].forEach(name => {
                field(name)?.closest('.fitem')?.classList.toggle('d-none', !showCover);
            });
            field('smu_play')?.closest('.fitem')?.classList.toggle('d-none', !useCard || !media);
        };
        form.addEventListener('change', refresh);
        form.addEventListener('input', refresh);
        refresh();
        return () => {
            form.removeEventListener('change', refresh);
            form.removeEventListener('input', refresh);
        };
    }, []);

    const applyPreset = (name: string) => {
        const preset = presets[name];
        if (preset) {
            ['course', 'launch', 'viewer'].forEach((option, index) => {
                const field = trigger.current?.closest('form')?.querySelector<HTMLSelectElement>('[name="smu_' + option + '"]');
                if (field) {
                    field.value = preset[index];
                    field.dispatchEvent(new Event('change', {bubbles: true}));
                }
            });
        }
    };

    return <>
        <div className="d-flex flex-wrap align-items-center gap-2">
            <select className="form-select w-auto" value="" aria-label={props.preset} onChange={e => applyPreset(e.target.value)}>
                <option value="">{props.preset}</option>
                <option value="video">{props.preset_video}</option>
                <option value="document">{props.preset_document}</option>
                <option value="weblink">{props.preset_weblink}</option>
            </select>
            <button ref={trigger} className="btn btn-outline-secondary" type="button" onClick={() => setOpen(true)}>
                {props.previewresource}
            </button>
        </div>
        {open && createPortal(<dialog ref={dialog} className="smu-preview-dialog" aria-labelledby={id + '-title'}
            onCancel={e => { e.preventDefault(); setOpen(false); }}>
            <header className="card-header d-flex align-items-center justify-content-between">
                <h2 className="h5 mb-0" id={id + '-title'}>{props.previewresource}</h2>
                <button className="btn-close" aria-label={props.closepreview} type="button" onClick={() => setOpen(false)}/>
            </header>
            <div className="card-body d-flex flex-wrap align-items-center gap-2">
                <select className="form-select w-auto" aria-label={props.previewresource} value={surface}
                    onChange={e => setSurface(e.target.value)}>
                    <option value="course">{props.previewcourse}</option>
                    <option value="activity">{props.previewactivity}</option>
                    <option value="auxiliary">{props.previewauxiliary}</option>
                </select>
                <select className="form-select w-auto" aria-label={props.translationlanguage} value={language}
                    onChange={e => setLanguage(e.target.value)}>
                    <option value="">{props.translationlanguage}</option>
                    {props.languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                </select>
                <label className="d-flex align-items-center gap-2">
                    <input type="checkbox" className="form-check-input" checked={mobile} onChange={e => setMobile(e.target.checked)}/>
                    {props.previewmobile}
                </label>
            </div>
            <iframe ref={iframe} name={'smu-preview' + id} title={props.previewresource}
                className={mobile ? 'smu-preview-frame smu-preview-mobile' : 'smu-preview-frame'}/>
        </dialog>, document.body)}
    </>;
};

export default AppearancePreview;
