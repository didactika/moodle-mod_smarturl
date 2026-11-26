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
import type {MetadataTypeRecord, ParamDefRecord} from '../types';

const call = <T>(methodname: string, args: Record<string, unknown>): Promise<T> => fetchOne<T>({methodname, args});

export const trackView = (cmid: number): Promise<{cmid: number; tracked: boolean}> =>
    call('mod_smarturl_track_view', {cmid});

export const saveMetaType = (payload: Record<string, unknown>): Promise<MetadataTypeRecord> =>
    call('mod_smarturl_save_meta_type', payload);

export const deleteMetaType = (id: number): Promise<{deleted: boolean}> =>
    call('mod_smarturl_delete_meta_type', {id});

export const saveParamDef = (payload: Record<string, unknown>): Promise<ParamDefRecord> =>
    call('mod_smarturl_save_param_def', payload);

export const deleteParamDef = (id: number): Promise<{deleted: boolean}> =>
    call('mod_smarturl_delete_param_def', {id});

export const previewUrl = (
    template: string,
    courseid: number,
    bindings: Array<{param: string; mode: string; var: string; value: string}>,
): Promise<{resolved: string}> =>
    call('mod_smarturl_preview_url', {template, courseid, bindings});
