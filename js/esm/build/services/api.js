import{fetchOne as a}from"@moodle/lms/core/ajax";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Web service clients for mod_smarturl.
 *
 * @module     mod_smarturl/services/api
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const r=(e,t)=>a({methodname:e,args:t}),s=(e,t=!0)=>r("mod_smarturl_track_view",{cmid:e,fromviewer:t}),n=e=>r("mod_smarturl_save_meta_type",e),d=e=>r("mod_smarturl_delete_meta_type",{id:e}),i=e=>r("mod_smarturl_save_param_def",e),_=e=>r("mod_smarturl_delete_param_def",{id:e}),l=(e,t,o)=>r("mod_smarturl_preview_url",{template:e,courseid:t,bindings:o});export{d as deleteMetaType,_ as deleteParamDef,l as previewUrl,n as saveMetaType,i as saveParamDef,s as trackView};
