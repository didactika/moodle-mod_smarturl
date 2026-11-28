var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The pager of the catalogue: the page size, the rows on show and the previous and next pages.
 *
 * @module     mod_smarturl/components/admin/CataloguePager
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useId } from "react";
import Pix from "../common/Pix";
const CataloguePager = /* @__PURE__ */ __name(({ sizes, size, range, first, last, icons, strings: t, onSize, onPage }) => {
  const id = useId();
  return /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-3 small text-body-secondary", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "d-none d-sm-flex align-items-center gap-2", children: [
      /* @__PURE__ */ jsxDEV("label", { htmlFor: id, className: "mb-0", children: t.pagerlabel }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
        lineNumber: 37,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          className: "form-select form-select-sm",
          id,
          "data-region": "perpage",
          value: size,
          onChange: (event) => onSize(Number(event.target.value)),
          children: sizes.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option, children: option || t.all }, option, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
            lineNumber: 40,
            columnNumber: 38
          }))
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
          lineNumber: 38,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
      lineNumber: 36,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-3 ms-auto", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "text-body text-nowrap", role: "status", "data-region": "range", children: range }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
        lineNumber: 44,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "d-flex gap-1", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-outline-secondary btn-sm btn-icon",
            "data-action": "prev",
            disabled: first,
            title: t.previous,
            "aria-label": t.previous,
            onClick: () => onPage(-1),
            children: /* @__PURE__ */ jsxDEV(Pix, { html: icons["i/previous"] }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
              lineNumber: 47,
              columnNumber: 91
            })
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
            lineNumber: 46,
            columnNumber: 17
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-outline-secondary btn-sm btn-icon",
            "data-action": "next",
            disabled: last,
            title: t.next,
            "aria-label": t.next,
            onClick: () => onPage(1),
            children: /* @__PURE__ */ jsxDEV(Pix, { html: icons["i/next"] }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
              lineNumber: 49,
              columnNumber: 82
            })
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
            lineNumber: 48,
            columnNumber: 17
          }
        )
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
        lineNumber: 45,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
      lineNumber: 43,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CataloguePager.tsx",
    lineNumber: 35,
    columnNumber: 12
  });
}, "CataloguePager");
var CataloguePager_default = CataloguePager;
export {
  CataloguePager_default as default
};
//# sourceMappingURL=CataloguePager.dev.js.map
