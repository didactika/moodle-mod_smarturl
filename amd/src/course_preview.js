/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Ajax from 'core/ajax';

/**
 * Loads and tracks an inline preview on its first expansion.
 *
 * @param {string} id Details element ID.
 * @param {number} cmid Module ID.
 */
export const init = (id, cmid) => {
    const details = document.getElementById(id);
    const activate = () => {
        if (details.open) {
            const template = details.querySelector('template');
            details.querySelector('[data-region="player"]').append(template.content.cloneNode(true));
            details.removeEventListener('toggle', activate);
            Ajax.call([{methodname: 'mod_smarturl_track_view', args: {cmid, fromviewer: false}}])[0].catch(() => null);
        }
    };
    details.addEventListener('toggle', activate);
};
