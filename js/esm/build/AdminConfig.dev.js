var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/AdminConfig
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useRef, useState } from "react";
import { installSelectMenus } from "./lib/selectMenus";
import { openSchemaModal } from "./lib/schemaModal";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
const Icon = /* @__PURE__ */ __name(({ name }) => /* @__PURE__ */ jsxDEV("i", { className: "fa fa-" + name, "aria-hidden": "true" }, void 0, false, {
  fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
  lineNumber: 28,
  columnNumber: 42
}), "Icon");
const AdminConfig = /* @__PURE__ */ __name((props) => {
  const { strings: t } = props;
  const [tab, setTab] = useState(props.tab);
  const [rows, setRows] = useState(props.rows);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(0);
  const [failure, setFailure] = useState("");
  const root = useRef(null);
  const queryApplied = useDebouncedValue(query.trim().toLocaleLowerCase(), 400);
  const section = props.sections.find((candidate) => candidate.key === tab) ?? props.sections[0];
  useEffect(() => root.current ? installSelectMenus(root.current) : void 0, []);
  const open = /* @__PURE__ */ __name((opener, row, remove = false) => {
    setFailure("");
    const title = document.createElement("span");
    title.textContent = row ? remove ? t.deletecategoryheading.replace("{$a}", row.name) : t.edit : section.add;
    openSchemaModal({
      formClass: "mod_smarturl\\form\\schema_item",
      args: { section: tab, id: row?.id ?? 0, remove: Number(remove) },
      modalConfig: { title: title.innerHTML, large: false, scrollable: true },
      saveButtonText: remove ? t.delete : t.savechanges,
      saveButtonClasses: remove ? "btn-danger" : void 0,
      returnFocus: opener
    }, setRows, setFailure);
  }, "open");
  const matches = rows[tab].filter((row) => (!status || row.enabled === (status === "active")) && [row.name, row.detail, ...row.columns].some((text) => text.toLocaleLowerCase().includes(queryApplied)));
  const total = matches.length;
  const options = [12, 24, 48, 96].filter((size2) => size2 < total);
  if (total <= 500) {
    options.push(0);
  }
  const size = options.includes(perPage) ? perPage : options.at(-1) ?? 12;
  const span = size || Math.max(1, total);
  const current = Math.min(page, Math.max(0, Math.ceil(total / span) - 1));
  const offset = current * span;
  const range = t.pagerange.replace("{$a->from}", String(total ? offset + 1 : 0)).replace("{$a->to}", String(Math.min(offset + span, total))).replace("{$a->total}", String(total));
  const clear = /* @__PURE__ */ __name(() => {
    setQuery("");
    setStatus("");
    setPage(0);
  }, "clear");
  return /* @__PURE__ */ jsxDEV("div", { className: "smu-schema", ref: root, children: [
    /* @__PURE__ */ jsxDEV("p", { className: "text-body-secondary", children: t.adminconfigsubtitle }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 74,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("nav", { className: "nav nav-tabs mb-3", "aria-label": t.settings, children: props.sections.map((item) => /* @__PURE__ */ jsxDEV(
      "a",
      {
        href: props.adminUrl + "?tab=" + item.key,
        className: "nav-link" + (item.key === tab ? " active" : ""),
        "aria-current": item.key === tab ? "page" : void 0,
        onClick: (event) => {
          if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setTab(item.key);
            clear();
            window.history.replaceState(null, "", event.currentTarget.href);
          }
        },
        children: [
          item.title,
          " ",
          /* @__PURE__ */ jsxDEV("span", { className: "badge rounded-pill smu-state", children: rows[item.key].length }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 85,
            columnNumber: 33
          })
        ]
      },
      item.key,
      true,
      {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 76,
        columnNumber: 41
      }
    )) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 75,
      columnNumber: 9
    }),
    failure && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-danger", role: "alert", children: failure }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 87,
      columnNumber: 21
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "smu-list-toolbar d-flex align-items-center flex-wrap gap-2 mb-3", children: [
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          className: "form-control",
          type: "search",
          "aria-label": t.search,
          placeholder: t.search,
          value: query,
          onChange: (event) => {
            setQuery(event.target.value);
            setPage(0);
          }
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 89,
          columnNumber: 13
        }
      ),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          className: "form-select smu-status-filter",
          value: status,
          "aria-label": t.status,
          onChange: (event) => {
            setStatus(event.target.value);
            setPage(0);
          },
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "", children: t.status }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 93,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV("option", { value: "active", children: t.enabled }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 93,
              columnNumber: 53
            }),
            /* @__PURE__ */ jsxDEV("option", { value: "inactive", children: t.disabled }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 94,
              columnNumber: 17
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 91,
          columnNumber: 13
        }
      ),
      status && /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "btn btn-outline-secondary smu-iconpill",
          onClick: () => {
            setStatus("");
            setPage(0);
          },
          title: t.clearfilters,
          "aria-label": t.clearfilters,
          dangerouslySetInnerHTML: { __html: props.clearIcon }
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 96,
          columnNumber: 24
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-list-actions d-flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxDEV("a", { href: props.settingsUrl, className: "btn btn-outline-secondary", children: [
          /* @__PURE__ */ jsxDEV(Icon, { name: "gear" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 100,
            columnNumber: 83
          }),
          " ",
          t.settings
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 100,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-primary", onClick: (event) => open(event.currentTarget), children: [
          /* @__PURE__ */ jsxDEV(Icon, { name: "plus" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 102,
            columnNumber: 21
          }),
          " ",
          section.add
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 101,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 99,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 88,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "table-responsive smu-list-table", "data-region": "tablewrap", children: [
        /* @__PURE__ */ jsxDEV("table", { className: "table table-hover align-middle mb-0", children: [
          /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden", children: section.title }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 109,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDEV("th", { scope: "col", children: t.name }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 111,
              columnNumber: 25
            }),
            section.columns.map((column) => /* @__PURE__ */ jsxDEV("th", { scope: "col", children: column }, column, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 112,
              columnNumber: 56
            })),
            /* @__PURE__ */ jsxDEV("th", { scope: "col", className: "smu-fit", children: t.status }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 113,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("th", { scope: "col", className: "smu-fit", children: /* @__PURE__ */ jsxDEV("span", { className: "visually-hidden", children: t.actions }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 114,
              columnNumber: 61
            }) }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 114,
              columnNumber: 25
            })
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 110,
            columnNumber: 28
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 110,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("tbody", { children: matches.slice(offset, offset + span).map((row) => /* @__PURE__ */ jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDEV("th", { scope: "row", children: [
              /* @__PURE__ */ jsxDEV("a", { href: "#item-" + row.id, onClick: (event) => {
                event.preventDefault();
                open(event.currentTarget, row);
              }, children: row.name }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 118,
                columnNumber: 29
              }),
              row.detail && /* @__PURE__ */ jsxDEV("div", { className: "small text-body-secondary", children: /* @__PURE__ */ jsxDEV("code", { children: row.detail }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 121,
                columnNumber: 87
              }) }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 121,
                columnNumber: 44
              })
            ] }, void 0, true, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 117,
              columnNumber: 25
            }),
            row.columns.map((column, index) => /* @__PURE__ */ jsxDEV("td", { children: column }, index, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 123,
              columnNumber: 61
            })),
            /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge rounded-pill smu-state" + (row.enabled ? " smu-state-on" : ""), children: row.enabled ? t.enabled : t.disabled }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 124,
              columnNumber: 29
            }) }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 124,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("div", { className: "smu-row-actions", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  className: "btn btn-outline-secondary smu-iconpill tone-primary",
                  "aria-label": t.edit + " " + row.name,
                  title: t.edit,
                  onClick: (event) => open(event.currentTarget, row),
                  children: /* @__PURE__ */ jsxDEV(Icon, { name: "pen" }, void 0, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                    lineNumber: 130,
                    columnNumber: 33
                  })
                },
                void 0,
                false,
                {
                  fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                  lineNumber: 128,
                  columnNumber: 29
                }
              ),
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  type: "button",
                  className: "btn btn-outline-secondary smu-iconpill tone-danger",
                  "aria-label": t.delete + " " + row.name,
                  title: t.delete,
                  onClick: (event) => open(event.currentTarget, row, true),
                  children: /* @__PURE__ */ jsxDEV(Icon, { name: "trash" }, void 0, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                    lineNumber: 134,
                    columnNumber: 33
                  })
                },
                void 0,
                false,
                {
                  fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                  lineNumber: 132,
                  columnNumber: 29
                }
              )
            ] }, void 0, true, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 127,
              columnNumber: 29
            }) }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 127,
              columnNumber: 25
            })
          ] }, row.id, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 116,
            columnNumber: 77
          })) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 116,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 108,
          columnNumber: 17
        }),
        !total && /* @__PURE__ */ jsxDEV("div", { className: "p-4 text-center text-body-secondary", "data-region": "empty", children: [
          /* @__PURE__ */ jsxDEV("p", { children: query || status ? t.emptyresults : t.listempty }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 140,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary", onClick: (event) => query || status ? clear() : open(event.currentTarget), children: query || status ? t.clearfilters : section.add }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 141,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 139,
          columnNumber: 28
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 107,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-list-pager border-top px-3 py-2 d-flex align-items-center justify-content-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "d-flex align-items-center gap-2 small", children: [
          t.pagerlabel,
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              className: "form-select form-select-sm w-auto",
              value: size,
              onChange: (event) => {
                setPerPage(Number(event.target.value));
                setPage(0);
              },
              children: options.map((option) => /* @__PURE__ */ jsxDEV("option", { value: option, children: option || t.all }, option, false, {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 149,
                columnNumber: 48
              }))
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 147,
              columnNumber: 21
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 146,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "small text-body-secondary", role: "status", children: range }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 153,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "btn btn-link btn-sm",
              "aria-label": t.previous,
              title: t.previous,
              disabled: offset === 0,
              onClick: () => setPage(current - 1),
              children: /* @__PURE__ */ jsxDEV("span", { dangerouslySetInnerHTML: { __html: props.previousIcon } }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 155,
                columnNumber: 86
              })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 154,
              columnNumber: 21
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "btn btn-link btn-sm",
              "aria-label": t.next,
              title: t.next,
              disabled: offset + span >= total,
              onClick: () => setPage(current + 1),
              children: /* @__PURE__ */ jsxDEV("span", { dangerouslySetInnerHTML: { __html: props.nextIcon } }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 157,
                columnNumber: 96
              })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 156,
              columnNumber: 21
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 152,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 145,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 106,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
    lineNumber: 73,
    columnNumber: 12
  });
}, "AdminConfig");
var AdminConfig_default = AdminConfig;
export {
  AdminConfig_default as default
};
//# sourceMappingURL=AdminConfig.dev.js.map
