/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Typed value renderer for Didactika metadata entries.
 *
 * @module     mod_smarturl/components/viewer/MetadataValue
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useState} from 'react';
import {formatDuration, splitTags} from '../../lib/metadata';
import type {MetadataEntry} from '../../types';

interface MetadataValueProps {
    entry: MetadataEntry;
}

const MetadataValue = ({entry}: MetadataValueProps) => {
    const [expanded, setExpanded] = useState(false);

    switch (entry.datatype) {
        case 'BADGE':
            return <span className="badge badge-soft rounded-pill text-bg-primary">{entry.value}</span>;

        case 'TAGS': {
            const tags = splitTags(entry.value);
            return (
                <div className="dd-tags">
                    {tags.map((tag, idx) => (
                        <span key={`${tag}-${idx}`} className="dd-tag">{tag}</span>
                    ))}
                </div>
            );
        }

        case 'URL':
            return (
                <a href={entry.value} target="_blank" rel="noopener noreferrer">
                    {entry.value}
                </a>
            );

        case 'DURATION':
            return <span>{formatDuration(entry.value)}</span>;

        case 'BOOLEAN': {
            const truthy = ['1', 'true', 'yes', 'si'].includes(entry.value.trim().toLowerCase());
            return (
                <span className={`badge badge-soft rounded-pill ${truthy ? 'text-bg-success' : 'text-bg-secondary'}`}>
                    {truthy ? 'Yes' : 'No'}
                </span>
            );
        }

        case 'MULTILINE': {
            const isLong = entry.value.length > 180;
            const shown = !isLong || expanded ? entry.value : `${entry.value.slice(0, 180)}...`;
            return (
                <div>
                    <div className="mb-1">{shown}</div>
                    {isLong && (
                        <button
                            type="button"
                            className="btn btn-link btn-sm p-0"
                            onClick={() => setExpanded((prev) => !prev)}
                        >
                            {expanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>
            );
        }

        default:
            return <span>{entry.value}</span>;
    }
};

export default MetadataValue;
