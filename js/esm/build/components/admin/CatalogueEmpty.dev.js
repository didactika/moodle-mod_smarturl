var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The empty state of a catalogue section. After a search or a filter it says nothing matched and offers to clear them; the first
 * time it says what the section holds and offers to create the first item.
 *
 * @module     mod_smarturl/components/admin/CatalogueEmpty
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Pix from "../common/Pix";
const CatalogueEmpty = /* @__PURE__ */ __name(({ section, filtered, icons, strings: t, onAdd, onClear }) => /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-column align-items-center gap-2 px-4 py-5 text-center", children: [
  /* @__PURE__ */ jsxDEV("span", { className: "icon-box" + (filtered ? " text-info" : ""), children: /* @__PURE__ */ jsxDEV(Pix, { html: icons[filtered ? "a/search" : section.icon] }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueEmpty.tsx",
    lineNumber: 33,
    columnNumber: 13
  }) }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueEmpty.tsx",
    lineNumber: 32,
    columnNumber: 9
  }),
  /* @__PURE__ */ jsxDEV("p", { className: "h6 fw-bold mb-0", children: filtered ? t.emptyresults : section.emptytitle }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueEmpty.tsx",
    lineNumber: 35,
    columnNumber: 9
  }),
  /* @__PURE__ */ jsxDEV("p", { className: "text-body-secondary mb-0", children: filtered ? t.emptyresultstext : section.emptytext }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueEmpty.tsx",
    lineNumber: 36,
    columnNumber: 9
  }),
  filtered ? /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary mt-2", onClick: onClear, children: t.clearfilters }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueEmpty.tsx",
    lineNumber: 38,
    columnNumber: 15
  }) : /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-primary mt-2", onClick: (event) => onAdd(event.currentTarget), children: [
    /* @__PURE__ */ jsxDEV(Pix, { html: icons["t/add"] }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueEmpty.tsx",
      lineNumber: 40,
      columnNumber: 17
    }),
    " ",
    section.add
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueEmpty.tsx",
    lineNumber: 39,
    columnNumber: 15
  })
] }, void 0, true, {
  fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueEmpty.tsx",
  lineNumber: 31,
  columnNumber: 5
}), "CatalogueEmpty");
var CatalogueEmpty_default = CatalogueEmpty;
export {
  CatalogueEmpty_default as default
};
//# sourceMappingURL=CatalogueEmpty.dev.js.map
