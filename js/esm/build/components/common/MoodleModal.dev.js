var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/components/common/MoodleModal
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { requireAsync } from "@moodle/lms/core/amd";
function MoodleModal({ title, large, children, footer, onClose }) {
  const [mount, setMount] = useState();
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    let active = true;
    let instance;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : void 0;
    const safe = document.createElement("span");
    safe.textContent = title;
    void requireAsync("core/modal").then((Modal) => Modal.create({ title: safe.innerHTML, large, removeOnClose: false, returnElement: opener })).then((modal) => {
      if (!active) {
        modal.destroy();
        return;
      }
      instance = modal;
      const root = modal.getRoot();
      root.on("modal:hidden", () => close.current());
      const body = modal.getBody()[0];
      const bottom = root.find(".modal-footer")[0];
      const footerNode = bottom ?? document.createElement("div");
      setMount({ body, footer: footerNode });
      modal.show();
    }).catch(() => close.current());
    return () => {
      active = false;
      if (instance) {
        instance.getRoot().off("modal:hidden");
        instance.hide();
        instance.destroy();
      }
    };
  }, [title, large]);
  useEffect(() => {
    if (mount) {
      mount.footer.hidden = !footer;
      mount.footer.classList.toggle("d-none", !footer);
    }
  }, [mount, footer]);
  return mount ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
    createPortal(children, mount.body),
    footer && createPortal(footer, mount.footer)
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/common/MoodleModal.tsx",
    lineNumber: 76,
    columnNumber: 20
  }, this) : null;
}
__name(MoodleModal, "MoodleModal");
export {
  MoodleModal as default
};
//# sourceMappingURL=MoodleModal.dev.js.map
