var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/SettingsControls
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect } from "react";
import { installSettingsMenus } from "./lib/selectMenus";
function SettingsControls() {
  useEffect(installSettingsMenus, []);
  return null;
}
__name(SettingsControls, "SettingsControls");
export {
  SettingsControls as default
};
//# sourceMappingURL=SettingsControls.dev.js.map
