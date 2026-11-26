/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Interactive stage supporting click-to-play lazy inline iframe, modal lightbox, and popup/tab launch.
 *
 * @module     mod_smarturl/components/viewer/PlayerStage
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useState} from 'react';
import {trackView} from '../../services/api';
import type {ResourceViewProps} from '../../types';

interface PlayerStageProps {
    props: ResourceViewProps;
    modalOpen: boolean;
    onCloseModal: () => void;
    onOpenModal: () => void;
}

const PlayerStage = ({props, modalOpen, onCloseModal, onOpenModal}: PlayerStageProps) => {
    const [inlineMounted, setInlineMounted] = useState(props.displayMode === 'EMBED');
    const [tracked, setTracked] = useState(false);

    const notifyView = () => {
        if (tracked) {
            return;
        }
        setTracked(true);
        trackView(props.cmid).catch(() => null);
    };

    const launchPrimary = () => {
        notifyView();
        if (props.displayMode === 'POPUP') {
            window.open(
                props.resolvedUrl,
                `smarturl_${props.cmid}`,
                `width=${props.popupWidth},height=${props.popupHeight},scrollbars=yes,resizable=yes`
            );
            return;
        }
        if (props.displayMode === 'NEW') {
            window.open(props.resolvedUrl, '_blank', 'noopener,noreferrer');
            return;
        }
        if (props.displayMode === 'MODAL') {
            onOpenModal();
            return;
        }
        setInlineMounted(true);
    };

    return (
        <>
            <div className="smu-stage">
                {inlineMounted ? (
                    <div className="smu-frame-wrap" style={{aspectRatio: props.aspectRatio.replace(':', ' / ')}}>
                        <iframe
                            src={props.resolvedUrl}
                            title={props.name}
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div
                        className="smu-facade"
                        style={props.thumbnailUrl ? {backgroundImage: `linear-gradient(rgb(15 23 42 / 55%), rgb(15 23 42 / 65%)), url(${props.thumbnailUrl})`, color: '#fff'} : undefined}
                    >
                        <div className="d-grid gap-3 justify-items-center">
                            {props.intro && (
                                <div
                                    className="small"
                                    style={{maxWidth: '42rem'}}
                                    // Trusted Moodle formatted intro HTML.
                                    dangerouslySetInnerHTML={{__html: props.intro}}
                                />
                            )}
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={launchPrimary}>
                                    {props.displayMode === 'INLINE_IFRAME'
                                        ? (props.strings.launchiframe ?? 'Load interactive preview')
                                        : (props.strings.openresource ?? 'Open resource')}
                                </button>
                                <a
                                    href={props.goUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-secondary"
                                    onClick={notifyView}
                                >
                                    {props.strings.openresource ?? 'Open resource'}
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="smu-modal-backdrop" role="dialog" aria-modal="true" aria-label={props.name}>
                    <div className="smu-modal">
                        <div className="smu-modal-bar">
                            <span className="fw-semibold">{props.name}</span>
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCloseModal}>
                                {props.strings.closepreview ?? 'Close'}
                            </button>
                        </div>
                        <div className="smu-frame-wrap">
                            <iframe src={props.resolvedUrl} title={props.name} allowFullScreen/>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlayerStage;
