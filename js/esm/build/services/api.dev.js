var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
import { fetchOne } from "@moodle/lms/core/ajax";
const call = /* @__PURE__ */ __name((methodname, args) => fetchOne({ methodname, args }), "call");
const trackView = /* @__PURE__ */ __name((cmid) => call("mod_smarturl_track_view", { cmid }), "trackView");
const saveMetaType = /* @__PURE__ */ __name((payload) => call("mod_smarturl_save_meta_type", payload), "saveMetaType");
const deleteMetaType = /* @__PURE__ */ __name((id) => call("mod_smarturl_delete_meta_type", { id }), "deleteMetaType");
const saveParamDef = /* @__PURE__ */ __name((payload) => call("mod_smarturl_save_param_def", payload), "saveParamDef");
const deleteParamDef = /* @__PURE__ */ __name((id) => call("mod_smarturl_delete_param_def", { id }), "deleteParamDef");
const previewUrl = /* @__PURE__ */ __name((template, courseid, bindings) => call("mod_smarturl_preview_url", { template, courseid, bindings }), "previewUrl");
export {
  deleteMetaType,
  deleteParamDef,
  previewUrl,
  saveMetaType,
  saveParamDef,
  trackView
};
//# sourceMappingURL=api.dev.js.map
