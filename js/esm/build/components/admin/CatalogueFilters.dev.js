var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The toolbar of the catalogue: the search, the status chips with what each leaves, and the button that clears them.
 *
 * @module     mod_smarturl/components/admin/CatalogueFilters
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useId } from "react";
import Pix from "../common/Pix";
const CatalogueFilters = /* @__PURE__ */ __name(({ search, status, counts, narrowed, icons, strings: t, onSearch, onStatus, onClear }) => {
  const id = useId();
  const chips = [["", t.all], ["active", t.enabled], ["inactive", t.disabled]];
  return /* @__PURE__ */ jsxDEV("div", { className: "d-flex align-items-center justify-content-between gap-3", "data-region": "filters", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex align-items-center gap-2 flex-grow-1", children: /* @__PURE__ */ jsxDEV("div", { className: "position-relative d-flex align-items-center", role: "search", "aria-label": t.search, children: [
      /* @__PURE__ */ jsxDEV(Pix, { html: icons["a/search"] }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
        lineNumber: 40,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("label", { className: "visually-hidden", htmlFor: id, children: t.search }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
        lineNumber: 41,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          className: "form-control",
          type: "search",
          id,
          "data-region": "search",
          placeholder: t.search,
          autoComplete: "off",
          value: search,
          onChange: (event) => onSearch(event.target.value),
          onKeyDown: (event) => event.key === "Enter" && event.preventDefault()
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
          lineNumber: 42,
          columnNumber: 17
        }
      ),
      search && /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "btn btn-link btn-icon btn-sm",
          "data-action": "clear-search",
          title: t.clear,
          "aria-label": t.clear,
          onClick: () => onSearch(""),
          children: /* @__PURE__ */ jsxDEV(Pix, { html: icons["e/cancel"] }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
            lineNumber: 46,
            columnNumber: 87
          })
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
          lineNumber: 45,
          columnNumber: 28
        }
      )
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
      lineNumber: 39,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
      lineNumber: 38,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex align-items-center gap-2 flex-shrink-0", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "d-flex align-items-center gap-2", role: "group", "aria-label": t.status, "data-region": "chips", children: chips.map(([value, label]) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          "data-status": value,
          className: "btn btn-sm btn-outline-secondary rounded-pill" + (status === value ? " active" : ""),
          "aria-pressed": status === value,
          onClick: () => onStatus(value),
          children: [
            label,
            " ",
            /* @__PURE__ */ jsxDEV("span", { className: "badge rounded-pill text-bg-primary", children: counts[value] }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
              lineNumber: 54,
              columnNumber: 29
            })
          ]
        },
        value,
        true,
        {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
          lineNumber: 51,
          columnNumber: 48
        }
      )) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
        lineNumber: 50,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "btn btn-link btn-icon",
          "data-action": "clearfilters",
          disabled: !narrowed,
          title: t.clearfilters,
          "aria-label": t.clearfilters,
          onClick: onClear,
          children: /* @__PURE__ */ jsxDEV(Pix, { html: icons["i/reload"] }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
            lineNumber: 58,
            columnNumber: 86
          })
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
          lineNumber: 57,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
      lineNumber: 49,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueFilters.tsx",
    lineNumber: 37,
    columnNumber: 12
  });
}, "CatalogueFilters");
var CatalogueFilters_default = CatalogueFilters;
export {
  CatalogueFilters_default as default
};
//# sourceMappingURL=CatalogueFilters.dev.js.map
