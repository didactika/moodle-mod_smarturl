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
import MoodleModal from '../common/MoodleModal';
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
    const modal = props.displayMode === 'MODAL';
    const canPreview = props.playerHtml && (modal || props.displayMode === 'INLINE_IFRAME');
    const icon = <i className={props.playable ? 'fa fa-play' : 'fa fa-external-link'} aria-hidden="true"/>;
    const circle = 'btn btn-primary smu-launch-circle' + (props.thumbnailUrl ? ' smu-play-overlay' : '');
    const label = props.playable ? props.strings.playresource
        : canPreview ? (modal ? props.strings.launchmodal : props.strings.launchiframe) : props.strings.openresource;
    const player = <div className="smu-player"
        style={{'--smu-player-ratio': props.aspectRatio.replace(':', ' / ')} as React.CSSProperties}
        dangerouslySetInnerHTML={{__html: props.playerHtml}}/>;

    return <section className="smu-stage">
        {mounted && props.playerHtml ? player : <div className={props.thumbnailUrl ? 'smu-cover-stage' : 'smu-empty-stage'}>
            {props.thumbnailUrl && <img src={props.thumbnailUrl} alt="" className="smu-viewer-cover"/>}
            {canPreview ? <button type="button" className={circle} aria-label={label} title={label} onClick={() => {
                void trackView(props.cmid).catch(() => undefined);
                if (modal) {
                    onOpenModal();
                } else {
                    setMounted(true);
                }
            }}>{icon}</button> : <a href={props.goUrl} target="_blank" rel="noopener noreferrer" className={circle}
                title={label} aria-label={label}>{icon}</a>}
        </div>}
        {modalOpen && <MoodleModal title={props.name} large onClose={onCloseModal}>
            <div className="mod-smarturl">{player}</div>
        </MoodleModal>}
    </section>;
};

export default PlayerStage;
