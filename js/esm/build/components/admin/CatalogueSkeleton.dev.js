var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The columns and the header of a section with rows of placeholders, drawn while its rows are on their way, so a new section
 * never shows the rows of the one before and a filter never shows rows it does not match.
 *
 * @module     mod_smarturl/components/admin/CatalogueSkeleton
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { Columns } from "./CatalogueTable";
const ROWS = 8;
const CatalogueSkeleton = /* @__PURE__ */ __name(({ section, detailed, strings: t }) => {
  const widths = [["w-75", detailed ? "w-50" : ""], ...section.columns.map(() => ["w-75"]), ["w-50"]];
  return /* @__PURE__ */ jsxDEV("table", { className: "table w-100", children: [
    /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden", children: section.title }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
      lineNumber: 32,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Columns, { section }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
      lineNumber: 33,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
      [t.name, ...section.columns, t.status].map((title) => /* @__PURE__ */ jsxDEV("th", { scope: "col", children: title }, title, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
        lineNumber: 36,
        columnNumber: 70
      })),
      /* @__PURE__ */ jsxDEV("th", { scope: "col", className: "text-end", "data-column": "actions" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
        lineNumber: 37,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
      lineNumber: 35,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
      lineNumber: 34,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("tbody", { children: Array.from({ length: ROWS }, (_, row) => /* @__PURE__ */ jsxDEV("tr", { "aria-hidden": "true", children: [
      widths.map((cell, index) => /* @__PURE__ */ jsxDEV("td", { children: cell.filter(Boolean).map((width) => /* @__PURE__ */ jsxDEV("span", { className: "placeholder " + width }, width, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
        lineNumber: 43,
        columnNumber: 56
      })) }, index, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
        lineNumber: 42,
        columnNumber: 46
      })),
      /* @__PURE__ */ jsxDEV("td", { className: "text-end", "data-column": "actions", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "placeholder" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
          lineNumber: 45,
          columnNumber: 64
        }),
        /* @__PURE__ */ jsxDEV("span", { className: "placeholder" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
          lineNumber: 45,
          columnNumber: 95
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
        lineNumber: 45,
        columnNumber: 17
      })
    ] }, row, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
      lineNumber: 41,
      columnNumber: 53
    })) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
      lineNumber: 40,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueSkeleton.tsx",
    lineNumber: 31,
    columnNumber: 12
  });
}, "CatalogueSkeleton");
var CatalogueSkeleton_default = CatalogueSkeleton;
export {
  CatalogueSkeleton_default as default
};
//# sourceMappingURL=CatalogueSkeleton.dev.js.map
