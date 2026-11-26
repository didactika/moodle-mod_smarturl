/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Interactive stage supporting embedded iframe, lazy inline preview, modal lightbox, and launch cards.
 *
 * @module     mod_smarturl/components/viewer/PlayerStage
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useRef, useState} from 'react';
import {trackView} from '../../services/api';
import type {ResourceViewProps} from '../../types';

interface PlayerStageProps {
    props: ResourceViewProps;
    modalOpen: boolean;
    onCloseModal: () => void;
    onOpenModal: () => void;
}

const PlayerStage = ({props, modalOpen, onCloseModal, onOpenModal}: PlayerStageProps) => {
    const [mounted, setMounted] = useState(props.displayMode === 'EMBED');
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const modal = props.displayMode === 'MODAL';
    const canPreview = props.playerHtml && (modal || props.displayMode === 'INLINE_IFRAME');

    useEffect(() => {
        if (!modalOpen || !dialog.current) {
            return undefined;
        }
        const node = dialog.current;
        node.showModal();
        return () => {
            node.close();
            trigger.current?.focus();
        };
    }, [modalOpen]);

    const player = <div className="smu-player"
        style={{'--smu-player-ratio': props.aspectRatio.replace(':', ' / ')} as React.CSSProperties}
        dangerouslySetInnerHTML={{__html: props.playerHtml}}/>;

    const external = <a href={props.goUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary">
        {props.strings.openresource}
    </a>;

    return <section className="smu-stage">
        {mounted && props.playerHtml ? player : (
            <div className="card">
                {props.thumbnailUrl && <img src={props.thumbnailUrl} alt="" className="smu-viewer-cover"/>}
                <div className="card-body d-flex flex-wrap gap-2">
                    {canPreview ? (
                        <button ref={trigger} type="button" className="btn btn-primary"
                            onClick={() => {
                                void trackView(props.cmid).catch(() => undefined);
                                if (modal) {
                                    onOpenModal();
                                } else {
                                    setMounted(true);
                                }
                            }}>
                            {modal ? props.strings.launchmodal : props.strings.launchiframe}
                        </button>
                    ) : external}
                </div>
            </div>
        )}

        {modalOpen && (
            <dialog ref={dialog} className="smu-player-dialog" aria-label={props.name}
                onCancel={(event) => {
                    event.preventDefault();
                    onCloseModal();
                }}>
                <div className="card">
                    <header className="card-header d-flex align-items-center justify-content-between gap-2">
                        <strong>{props.name}</strong>
                        <button type="button" className="btn-close" aria-label={props.strings.closepreview} onClick={onCloseModal}/>
                    </header>
                    <div className="card-body">{player}</div>
                    <footer className="card-footer">{external}</footer>
                </div>
            </dialog>
        )}
    </section>;
};

export default PlayerStage;
