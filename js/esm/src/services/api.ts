/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Web service clients for mod_smarturl.
 *
 * @module     mod_smarturl/services/api
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {fetchOne} from '@moodle/lms/core/ajax';

const call = <T>(methodname: string, args: Record<string, unknown>): Promise<T> => fetchOne<T>({methodname, args});

export const trackView = (cmid: number, fromviewer = true): Promise<{cmid: number; tracked: boolean}> =>
    call('mod_smarturl_track_view', {cmid, fromviewer});
