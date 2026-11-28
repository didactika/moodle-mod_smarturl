var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The header of the catalogue, with what the page manages and its actions, and a tab for each section with its count.
 *
 * @module     mod_smarturl/components/admin/CatalogueHeader
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Pix from "../common/Pix";
const CatalogueHeader = /* @__PURE__ */ __name(({ sections, current, rows, adminUrl, settingsUrl, icons, strings: t, onSection, onAdd }) => {
  const choose = /* @__PURE__ */ __name((key) => (event) => {
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      onSection(key);
    }
  }, "choose");
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "d-grid gap-3 pb-3 border-bottom", "data-region": "page-header", children: /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-3", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "d-flex align-items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "icon-box", children: /* @__PURE__ */ jsxDEV(Pix, { html: icons.monologo }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
          lineNumber: 45,
          columnNumber: 48
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
          lineNumber: 45,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("p", { className: "text-body-secondary mb-0", children: t.adminconfigsubtitle }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
          lineNumber: 46,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
        lineNumber: 44,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-2", "data-region": "actions", children: [
        /* @__PURE__ */ jsxDEV("a", { className: "btn btn-outline-secondary", href: settingsUrl, children: [
          /* @__PURE__ */ jsxDEV(Pix, { html: icons["i/settings"] }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
            lineNumber: 49,
            columnNumber: 81
          }),
          " ",
          t.settings
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
          lineNumber: 49,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-primary",
            "data-action": "add",
            onClick: (event) => onAdd(event.currentTarget),
            children: [
              /* @__PURE__ */ jsxDEV(Pix, { html: icons["t/add"] }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
                lineNumber: 52,
                columnNumber: 25
              }),
              " ",
              current.add
            ]
          },
          void 0,
          true,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
            lineNumber: 50,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
        lineNumber: 48,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
      lineNumber: 43,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
      lineNumber: 42,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("ul", { className: "nav nav-tabs", "aria-label": t.settings, children: sections.map((section) => /* @__PURE__ */ jsxDEV("li", { className: "nav-item", children: /* @__PURE__ */ jsxDEV(
      "a",
      {
        className: "nav-link" + (section.key === current.key ? " active" : ""),
        href: adminUrl + "?tab=" + section.key,
        "data-tab": section.key,
        "aria-current": section.key === current.key ? "page" : void 0,
        onClick: choose(section.key),
        children: [
          /* @__PURE__ */ jsxDEV("span", { children: section.title }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
            lineNumber: 62,
            columnNumber: 21
          }),
          " ",
          /* @__PURE__ */ jsxDEV("span", { className: "badge rounded-pill text-bg-secondary", children: rows[section.key].length }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
            lineNumber: 63,
            columnNumber: 26
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
        lineNumber: 59,
        columnNumber: 17
      }
    ) }, section.key, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
      lineNumber: 58,
      columnNumber: 38
    })) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
      lineNumber: 57,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueHeader.tsx",
    lineNumber: 41,
    columnNumber: 12
  });
}, "CatalogueHeader");
var CatalogueHeader_default = CatalogueHeader;
export {
  CatalogueHeader_default as default
};
//# sourceMappingURL=CatalogueHeader.dev.js.map
