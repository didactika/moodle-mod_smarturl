/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useId, useRef, useState} from 'react';
import MoodleModal from './components/common/MoodleModal';
import {installSelectMenus} from './lib/selectMenus';

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
    translationlanguage: string;
    previewcurrentlanguage: string;
    closepreview: string;
}

const AppearancePreview = (props: PreviewProps) => {
    const trigger = useRef<HTMLButtonElement>(null);
    const iframe = useRef<HTMLIFrameElement>(null);
    const id = useId();
    const [open, setOpen] = useState(false);
    const [surface, setSurface] = useState('course');
    const [language, setLanguage] = useState('');
    const [mobile, setMobile] = useState(false);

    const [previewPane, setPreviewPane] = useState<HTMLDivElement | null>(null);
    useEffect(() => previewPane ? installSelectMenus(previewPane) : undefined, [previewPane]);

    useEffect(() => {
        const editor = trigger.current?.closest('form');
        if (!open || !editor || !previewPane || !iframe.current) {
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
    }, [open, previewPane, surface, language, props.url, props.courseid, props.cmid, props.sesskey]);

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
            const viewer = field('smu_viewer')?.value || 'AUTO';
            const href = field('externalurl')?.value ?? '';
            const media = /(?:youtube\.com|youtu\.be|vimeo\.com|\.(?:mp4|webm|mp3|wav|ogg)(?:[?#]|$))/i.test(href);
            const showCover = useCard || (!launch.startsWith('EXTERNAL') && (viewer !== 'AUTO' || !media) && viewer !== 'EMBED');
            const popup = ['VIEWERWINDOW', 'EXTERNALWINDOW'].includes(launch);
            ['popup_width', 'popup_height'].forEach(name => field(name)?.closest('.fitem')?.classList.toggle('d-none', !popup));
            form.querySelector('[data-smu-cover-heading]')?.classList.toggle('d-none', !showCover);
            ['smu_poster', 'thumbnail_url', 'poster_filemanager'].forEach(name => {
                field(name)?.closest('.fitem')?.classList.toggle('d-none', !showCover);
            });
            field('smu_play')?.closest('.fitem')?.classList.toggle('d-none', !useCard || !media);
        };
        form.addEventListener('change', refresh);
        form.addEventListener('input', refresh);
        refresh();
        const cleanMenus = installSelectMenus(form);
        return () => {
            cleanMenus();
            form.removeEventListener('change', refresh);
            form.removeEventListener('input', refresh);
        };
    }, []);

    return <>
        <div className="d-flex flex-wrap align-items-center gap-2">
            <button ref={trigger} className="btn btn-outline-secondary" type="button" onClick={() => setOpen(true)}>
                <i className="fa fa-eye me-2" aria-hidden="true"/>{props.previewresource}
            </button>
        </div>
        {open && <MoodleModal title={props.previewresource} large onClose={() => setOpen(false)}>
            <div ref={setPreviewPane} className="mod-smarturl smu-preview-pane">
            <div className="smu-preview-toolbar d-flex flex-wrap align-items-center gap-2 pb-3 border-bottom">
                <select className="form-select w-auto" aria-label={props.previewresource} value={surface}
                    onChange={e => setSurface(e.target.value)}>
                    <option value="course">{props.previewcourse}</option>
                    <option value="activity">{props.previewactivity}</option>
                    <option value="auxiliary">{props.previewauxiliary}</option>
                </select>
                <select className="form-select w-auto" aria-label={props.translationlanguage} value={language}
                    onChange={e => setLanguage(e.target.value)}>
                    <option value="">{props.previewcurrentlanguage}</option>
                    {props.languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                </select>
                <div className="form-check form-switch smu-preview-switch">
                    <input id={id + "-mobile"} type="checkbox" className="form-check-input"
                        checked={mobile} onChange={e => setMobile(e.target.checked)}/>
                    <label className="form-check-label" htmlFor={id + "-mobile"}>{props.previewmobile}</label>
                </div>
            </div>
            <iframe ref={iframe} name={'smu-preview' + id} title={props.previewresource}
                className={mobile ? 'smu-preview-frame smu-preview-mobile' : 'smu-preview-frame'}/>
            </div>
        </MoodleModal>}
    </>;
};

export default AppearancePreview;
