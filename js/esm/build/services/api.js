import{fetchOne as o}from"@moodle/lms/core/ajax";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Web service clients for mod_smarturl.
 *
 * @module     mod_smarturl/services/api
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const t=(r,e)=>o({methodname:r,args:e}),c=(r,e=!0)=>t("mod_smarturl_track_view",{cmid:r,fromviewer:e});export{c as trackView};
