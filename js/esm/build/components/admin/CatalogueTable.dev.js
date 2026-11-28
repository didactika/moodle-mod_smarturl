var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The table of a catalogue section: its caption, its columns, the header and one row for each item on the page. The name of a
 * row opens it; the actions keep one slot each, in one order (edit, delete), so each action is always in the same column.
 *
 * @module     mod_smarturl/components/admin/CatalogueTable
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Pix from "../common/Pix";
const Columns = /* @__PURE__ */ __name(({ section }) => /* @__PURE__ */ jsxDEV("colgroup", { children: [
  /* @__PURE__ */ jsxDEV("col", { "data-column": "name" }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
    lineNumber: 31,
    columnNumber: 5
  }),
  section.columns.map((column) => /* @__PURE__ */ jsxDEV("col", {}, column, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
    lineNumber: 32,
    columnNumber: 36
  })),
  /* @__PURE__ */ jsxDEV("col", { "data-column": "status" }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
    lineNumber: 33,
    columnNumber: 5
  }),
  /* @__PURE__ */ jsxDEV("col", { "data-column": "actions" }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
    lineNumber: 34,
    columnNumber: 5
  })
] }, void 0, true, {
  fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
  lineNumber: 30,
  columnNumber: 68
}), "Columns");
const CatalogueTable = /* @__PURE__ */ __name(({ section, rows, icons, strings: t, onOpen }) => {
  const open = /* @__PURE__ */ __name((row, remove) => (event) => {
    event.preventDefault();
    onOpen(event.currentTarget, row, remove);
  }, "open");
  return /* @__PURE__ */ jsxDEV("table", { className: "table w-100", children: [
    /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden", children: section.title }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
      lineNumber: 50,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Columns, { section }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
      lineNumber: 51,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
      /* @__PURE__ */ jsxDEV("th", { scope: "col", "data-column": "name", children: t.name }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 54,
        columnNumber: 17
      }),
      section.columns.map((column) => /* @__PURE__ */ jsxDEV("th", { scope: "col", children: column }, column, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 55,
        columnNumber: 48
      })),
      /* @__PURE__ */ jsxDEV("th", { scope: "col", "data-column": "status", children: t.status }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 56,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("th", { scope: "col", className: "text-end text-nowrap", "data-column": "actions", children: /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: t.actions }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 58,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 57,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
      lineNumber: 53,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
      lineNumber: 52,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("tbody", { children: rows.map((row) => /* @__PURE__ */ jsxDEV("tr", { "data-id": row.id, children: [
      /* @__PURE__ */ jsxDEV("th", { scope: "row", "data-column": "name", children: /* @__PURE__ */ jsxDEV("span", { className: "d-flex flex-column overflow-hidden", children: [
        /* @__PURE__ */ jsxDEV("a", { className: "fw-bold text-truncate", href: "#item-" + row.id, title: row.name, onClick: open(row, false), children: row.name }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
          lineNumber: 66,
          columnNumber: 25
        }),
        row.detail && /* @__PURE__ */ jsxDEV("span", { className: "small text-body-secondary text-truncate", children: /* @__PURE__ */ jsxDEV("code", { children: row.detail }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
          lineNumber: 69,
          columnNumber: 98
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
          lineNumber: 69,
          columnNumber: 40
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 65,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 64,
        columnNumber: 17
      }),
      row.columns.map((cell, index) => /* @__PURE__ */ jsxDEV("td", { children: cell }, index, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 72,
        columnNumber: 51
      })),
      /* @__PURE__ */ jsxDEV("td", { "data-column": "status", children: /* @__PURE__ */ jsxDEV("span", { className: "badge rounded-pill " + (row.enabled ? "text-bg-success" : "text-bg-secondary"), children: row.enabled ? t.enabled : t.disabled }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 74,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 73,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("td", { className: "text-end", "data-column": "actions", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-link btn-icon btn-sm text-primary",
            title: `${t.edit} ${row.name}`,
            "aria-label": `${t.edit} ${row.name}`,
            onClick: open(row, false),
            children: /* @__PURE__ */ jsxDEV(Pix, { html: icons["t/edit"] }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
              lineNumber: 80,
              columnNumber: 89
            })
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
            lineNumber: 79,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-link btn-icon btn-sm text-danger",
            title: `${t.delete} ${row.name}`,
            "aria-label": `${t.delete} ${row.name}`,
            onClick: open(row, true),
            children: /* @__PURE__ */ jsxDEV(Pix, { html: icons["t/delete"] }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
              lineNumber: 82,
              columnNumber: 90
            })
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
            lineNumber: 81,
            columnNumber: 21
          }
        )
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
        lineNumber: 78,
        columnNumber: 17
      })
    ] }, row.id, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
      lineNumber: 63,
      columnNumber: 30
    })) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
      lineNumber: 62,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/admin/CatalogueTable.tsx",
    lineNumber: 49,
    columnNumber: 12
  });
}, "CatalogueTable");
var CatalogueTable_default = CatalogueTable;
export {
  Columns,
  CatalogueTable_default as default
};
//# sourceMappingURL=CatalogueTable.dev.js.map
