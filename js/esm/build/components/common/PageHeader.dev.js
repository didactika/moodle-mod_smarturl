var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Didactika page header component (dd-page-header).
 *
 * @module     mod_smarturl/components/common/PageHeader
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
const PageHeader = /* @__PURE__ */ __name(({ breadcrumb, title, subtitle, iconLabel = "URL", actions }) => /* @__PURE__ */ jsxDEV("header", { className: "dd-page-header", children: [
  breadcrumb && breadcrumb.length > 0 && /* @__PURE__ */ jsxDEV("nav", { "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxDEV("ol", { className: "breadcrumb mb-0", children: breadcrumb.map((item, idx) => /* @__PURE__ */ jsxDEV(
    "li",
    {
      className: `breadcrumb-item${idx === breadcrumb.length - 1 ? " active" : ""}`,
      "aria-current": idx === breadcrumb.length - 1 ? "page" : void 0,
      children: item.href ? /* @__PURE__ */ jsxDEV("a", { href: item.href, children: item.label }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
        lineNumber: 33,
        columnNumber: 42
      }) : item.label
    },
    `${item.label}-${idx}`,
    false,
    {
      fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
      lineNumber: 28,
      columnNumber: 25
    }
  )) }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
    lineNumber: 26,
    columnNumber: 17
  }) }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
    lineNumber: 25,
    columnNumber: 13
  }),
  /* @__PURE__ */ jsxDEV("div", { className: "dd-page-header-row", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "dd-page-header-main", children: [
      iconLabel && /* @__PURE__ */ jsxDEV("span", { className: "dd-tile dd-tile-lg", "aria-hidden": "true", children: iconLabel }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
        lineNumber: 41,
        columnNumber: 31
      }),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "dd-page-title", children: title }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
          lineNumber: 43,
          columnNumber: 21
        }),
        subtitle && /* @__PURE__ */ jsxDEV("div", { className: "dd-page-subtitle", children: subtitle }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
          lineNumber: 44,
          columnNumber: 34
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
        lineNumber: 42,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
      lineNumber: 40,
      columnNumber: 13
    }),
    actions && /* @__PURE__ */ jsxDEV("div", { className: "dd-page-actions", children: actions }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
      lineNumber: 47,
      columnNumber: 25
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
    lineNumber: 39,
    columnNumber: 9
  })
] }, void 0, true, {
  fileName: "public/mod/smarturl/js/esm/src/components/common/PageHeader.tsx",
  lineNumber: 23,
  columnNumber: 5
}), "PageHeader");
var PageHeader_default = PageHeader;
export {
  PageHeader_default as default
};
//# sourceMappingURL=PageHeader.dev.js.map
