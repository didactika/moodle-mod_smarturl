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
        if (props.displayMode === 'NEW' || props.displayMode === 'OPEN' || props.displayMode === 'CARD' || props.displayMode === 'AUTO') {
            window.open(props.resolvedUrl, '_blank', 'noopener,noreferrer');
            return;
        }
        if (props.displayMode === 'MODAL') {
            onOpenModal();
            return;
        }
        setInlineMounted(true);
    };

    const primaryLabel = (() => {
        if (props.displayMode === 'INLINE_IFRAME') {
            return props.strings.launchiframe ?? 'Load preview here';
        }
        if (props.displayMode === 'MODAL') {
            return props.strings.launchmodal ?? 'Open preview';
        }
        if (props.displayMode === 'POPUP') {
            return props.strings.launchpopup ?? 'Open pop-up window';
        }
        return props.strings.openresource ?? 'Open in new tab';
    })();

    const hostLabel = (() => {
        try {
            return new URL(props.resolvedUrl).hostname;
        } catch {
            return props.resolvedUrl;
        }
    })();

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
                        className={`smu-facade${props.thumbnailUrl ? ' has-poster' : ''}`}
                        style={props.thumbnailUrl ? {backgroundImage: `linear-gradient(rgb(15 23 42 / 58%), rgb(15 23 42 / 72%)), url(${props.thumbnailUrl})`} : undefined}
                    >
                        <div className="smu-facade-inner">
                            <span className="smu-host-pill">{hostLabel}</span>
                            {props.intro && (
                                <div
                                    className="smu-facade-intro"
                                    // Trusted Moodle formatted intro HTML.
                                    dangerouslySetInnerHTML={{__html: props.intro}}
                                />
                            )}
                            <div className="smu-facade-actions">
                                <button type="button" className="btn btn-primary" onClick={launchPrimary}>
                                    {primaryLabel}
                                </button>
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
                            <div className="d-flex align-items-center gap-2">
                                <a
                                    href={props.goUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={notifyView}
                                >
                                    {props.strings.openresource ?? 'Open in new tab'}
                                </a>
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCloseModal}>
                                    {props.strings.closepreview ?? 'Close'}
                                </button>
                            </div>
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
