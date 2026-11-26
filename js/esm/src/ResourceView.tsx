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
import PageHeader from './components/common/PageHeader';
import MetadataExplorer from './components/viewer/MetadataExplorer';
import PlayerStage from './components/viewer/PlayerStage';
import {formatDuration} from './lib/metadata';
import {trackView} from './services/api';
import type {ResourceViewProps} from './types';

const ResourceView = (props: ResourceViewProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => {
        trackView(props.cmid).catch(() => null);
        if (props.displayMode === 'MODAL') {
            setModalOpen(true);
            return;
        }
        if (props.displayMode === 'POPUP') {
            window.open(
                props.resolvedUrl,
                `smarturl_${props.cmid}`,
                `width=${props.popupWidth},height=${props.popupHeight},scrollbars=yes,resizable=yes`
            );
            return;
        }
        window.open(props.resolvedUrl, '_blank', 'noopener,noreferrer');
    };

    const subtitle = (
        <>
            <span className="badge text-bg-light">{props.displayMode}</span>
            {props.durationSeconds && <span className="badge text-bg-light">{formatDuration(props.durationSeconds)}</span>}
            {props.policy.managedBy && (
                <span className="badge badge-soft rounded-pill text-bg-info">
                    {props.strings.managedbadge ?? 'Externally governed'}: {props.policy.managedBy}
                </span>
            )}
            {props.policy.lockedFields.length > 0 && (
                <span className="badge badge-soft rounded-pill text-bg-secondary">
                    {props.strings.lockedbadge ?? 'Policy locked'}: {props.policy.lockedFields.join(', ')}
                </span>
            )}
        </>
    );

    const actions = (
        <button type="button" className="btn btn-primary" onClick={handleOpen}>
            {props.strings.openresource ?? 'Open resource'}
        </button>
    );

    return (
        <div>
            <PageHeader
                breadcrumb={[{label: props.coursename, href: props.courseurl}, {label: props.name}]}
                title={props.name}
                subtitle={subtitle}
                iconLabel="URL"
                actions={actions}
            />

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
