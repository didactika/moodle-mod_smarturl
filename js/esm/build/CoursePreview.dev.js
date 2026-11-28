var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useState } from "react";
import { trackView } from "./services/api";
const CoursePreview = /* @__PURE__ */ __name(({ cmid, label, player }) => {
  const [loaded, setLoaded] = useState(false);
  return /* @__PURE__ */ jsxDEV("details", { className: "smu-course-inline", onToggle: (event) => {
    if (event.currentTarget.open && !loaded) {
      setLoaded(true);
      void trackView(cmid, false).catch(() => void 0);
    }
  }, children: [
    /* @__PURE__ */ jsxDEV("summary", { className: "btn btn-outline-secondary", children: label }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/CoursePreview.tsx",
      lineNumber: 25,
      columnNumber: 9
    }),
    loaded && /* @__PURE__ */ jsxDEV("div", { className: "smu-course-iframe-wrap", dangerouslySetInnerHTML: { __html: player } }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/CoursePreview.tsx",
      lineNumber: 26,
      columnNumber: 20
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/CoursePreview.tsx",
    lineNumber: 19,
    columnNumber: 12
  });
}, "CoursePreview");
var CoursePreview_default = CoursePreview;
export {
  CoursePreview_default as default
};
//# sourceMappingURL=CoursePreview.dev.js.map
