/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Main Smart URL view mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/ResourceView
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useState} from 'react';
import MetadataExplorer from './components/viewer/MetadataExplorer';
import PlayerStage from './components/viewer/PlayerStage';
import {formatDuration} from './lib/metadata';
import type {ResourceViewProps} from './types';

const DISPLAY_LABELS: Record<string, string> = {
    AUTO: 'Automatic',
    EMBED: 'Embedded on page',
    INLINE_IFRAME: 'Interactive preview',
    MODAL: 'Preview dialog',
    POPUP: 'Pop-up window',
    NEW: 'New browser tab',
    OPEN: 'Direct redirect',
    CARD: 'Preview card',
};

const ResourceView = (props: ResourceViewProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const hasDuration = typeof props.durationSeconds === 'number' && props.durationSeconds > 0;
    const isEmbedStage = props.displayMode === 'EMBED';
    const modeLabel = DISPLAY_LABELS[props.displayMode] ?? props.displayMode;

    return (
        <div className="smu-resource-shell">
            <div className="smu-resource-bar">
                <div className="dd-tags">
                    <span className="dd-tag">{modeLabel}</span>
                    {hasDuration && (
                        <span className="dd-tag">{formatDuration(props.durationSeconds)}</span>
                    )}
                    {props.policy.managedBy && (
                        <span className="dd-tag dd-tag-primary">
                            {props.strings.managedbadge ?? 'Managed externally'}: {props.policy.managedBy}
                        </span>
                    )}
                    {props.policy.lockedFields.length > 0 && (
                        <span className="dd-tag">
                            {props.strings.lockedbadge ?? 'Protected'}: {props.policy.lockedFields.join(', ')}
                        </span>
                    )}
                </div>
                {isEmbedStage && (
                    <a
                        href={props.goUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary btn-sm"
                    >
                        {props.strings.openresource ?? 'Open in new tab'}
                    </a>
                )}
            </div>

            <PlayerStage
                props={props}
                modalOpen={modalOpen}
                onOpenModal={() => setModalOpen(true)}
                onCloseModal={() => setModalOpen(false)}
            />

            {props.metadata.length > 0 && (
                <MetadataExplorer entries={props.metadata} strings={props.strings}/>
            )}
        </div>
    );
};

export default ResourceView;
