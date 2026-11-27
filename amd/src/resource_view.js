// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Didactika metadata explorer and media stage controller for Moodle 4.5 - 5.2.
 *
 * @module     mod_smarturl/resource_view
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Ajax from 'core/ajax';
import Modal from 'core/modal';

/**
 * Mounts the resource player after an intentional launch.
 *
 * @param {string} rootId Viewer container ID.
 */
export const init = rootId => {
    const root = document.getElementById(rootId);
    if (!root) {
        return;
    }
    const resource = JSON.parse(root.dataset.payload || '{}');
    const track = () => Ajax.call([{
        methodname: 'mod_smarturl_track_view',
        args: {cmid: Number(resource.cmid), fromviewer: true},
    }])[0].catch(() => null);

    root.addEventListener('click', async event => {
        const trigger = event.target.closest('[data-action="launch-inline"], [data-action="open-modal"]');
        if (!trigger) {
            return;
        }
        const player = document.createElement('div');
        player.className = 'smu-player';
        player.innerHTML = resource.playerHtml || '';
        if (trigger.dataset.action === 'launch-inline') {
            root.querySelector('.smu-stage')?.replaceChildren(player);
        } else {
            const title = document.createElement('span');
            title.textContent = resource.name;
            const modal = await Modal.create({title: title.innerHTML, large: true, removeOnClose: true, returnElement: trigger});
            const wrapper = document.createElement('div');
            wrapper.className = 'mod-smarturl';
            wrapper.append(player);
            modal.getBody()[0].replaceChildren(wrapper);
            modal.getRoot().find('.modal-footer').addClass('d-none');
            modal.show();
        }
        await track();
    });
};
