var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/lib/schemaModal
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { requireAsync } from "@moodle/lms/core/amd";
import { installSelectMenus } from "./selectMenus";
const openSchemaModal = /* @__PURE__ */ __name((options, update, failed) => {
  void requireAsync("core_form/modalform").then((Modal) => {
    const form = new Modal(options);
    form.addEventListener(form.events.LOADED, () => {
      const clickMenu = installSelectMenus(form.modal.getRoot()[0]);
      form.modal.getRoot().on("modal:hidden", clickMenu);
    });
    form.addEventListener(form.events.FORM_SUBMITTED, (event) => update(event.detail));
    return form.show();
  }).catch((error) => failed(error.message));
}, "openSchemaModal");
export {
  openSchemaModal
};
//# sourceMappingURL=schemaModal.dev.js.map
