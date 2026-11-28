/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useState} from 'react';
import {trackView} from './services/api';

interface CoursePreviewProps {
    cmid: number;
    label: string;
    player: string;
}

const CoursePreview = ({cmid, label, player}: CoursePreviewProps) => {
    const [loaded, setLoaded] = useState(false);
    return <details className="smu-course-inline" onToggle={event => {
        if (event.currentTarget.open && !loaded) {
            setLoaded(true);
            void trackView(cmid, false).catch(() => undefined);
        }
    }}>
        <summary className="btn btn-outline-secondary">{label}</summary>
        {loaded && <div className="smu-course-iframe-wrap" dangerouslySetInnerHTML={{__html: player}}/>}
    </details>;
};

export default CoursePreview;
