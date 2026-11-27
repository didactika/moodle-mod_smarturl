var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * High-volume metadata explorer with debounced search, group filter chips (dd-chips),
 * cards and a compact table.
 *
 * @module     mod_smarturl/components/viewer/MetadataExplorer
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { installSelectMenus } from "../../lib/selectMenus";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { computeGroupFacets, filterByQuery, groupEntries } from "../../lib/metadata";
import MetadataValue from "./MetadataValue";
const COLLAPSED_LIMIT = 18;
const MetadataExplorer = /* @__PURE__ */ __name(({ entries, strings }) => {
  const [searchText, setSearchText] = useState("");
  const [activeGroup, setActiveGroup] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [showAll, setShowAll] = useState(false);
  const controls = useRef(null);
  useEffect(() => controls.current ? installSelectMenus(controls.current) : void 0, []);
  const debouncedQuery = useDebouncedValue(searchText, 250);
  const queryMatched = useMemo(
    () => filterByQuery(entries, debouncedQuery),
    [entries, debouncedQuery]
  );
  const groupFacets = useMemo(
    () => computeGroupFacets(queryMatched),
    [queryMatched]
  );
  const visibleEntries = useMemo(
    () => activeGroup ? queryMatched.filter((e) => e.group === activeGroup) : queryMatched,
    [queryMatched, activeGroup]
  );
  const pagedEntries = useMemo(
    () => showAll || visibleEntries.length <= COLLAPSED_LIMIT ? visibleEntries : visibleEntries.slice(0, COLLAPSED_LIMIT),
    [visibleEntries, showAll]
  );
  const groupedCards = useMemo(
    () => groupEntries(pagedEntries),
    [pagedEntries]
  );
  const clearAll = /* @__PURE__ */ __name(() => {
    setSearchText("");
    setActiveGroup("");
  }, "clearAll");
  return /* @__PURE__ */ jsxDEV("section", { ref: controls, "aria-labelledby": "smu-metadata-title", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "smu-meta-toolbar", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "smu-meta-toprow", children: [
        /* @__PURE__ */ jsxDEV("h2", { id: "smu-metadata-title", className: "h5 mb-0", children: strings.metadataheading ?? "Resource metadata" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 71,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-2", children: /* @__PURE__ */ jsxDEV("div", { className: "btn-group", role: "group", "aria-label": strings.metadataheading, children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "btn btn-outline-secondary btn-sm" + (viewMode === "cards" ? " active" : ""),
              "aria-pressed": viewMode === "cards",
              onClick: () => setViewMode("cards"),
              children: strings.viewcards ?? "Grouped cards"
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
              lineNumber: 77,
              columnNumber: 29
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "btn btn-outline-secondary btn-sm" + (viewMode === "table" ? " active" : ""),
              "aria-pressed": viewMode === "table",
              onClick: () => setViewMode("table"),
              children: strings.viewtable ?? "Compact table"
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
              lineNumber: 85,
              columnNumber: 29
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 76,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 75,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 70,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-meta-toprow", children: [
        /* @__PURE__ */ jsxDEV(
          "form",
          {
            role: "search",
            className: "smu-meta-search",
            onSubmit: (e) => e.preventDefault(),
            children: [
              /* @__PURE__ */ jsxDEV("label", { htmlFor: "smu-meta-search-input", className: "visually-hidden", children: strings.metadatasearch ?? "Search metadata" }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                lineNumber: 103,
                columnNumber: 25
              }),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  id: "smu-meta-search-input",
                  type: "search",
                  className: "form-control",
                  value: searchText,
                  onChange: (e) => setSearchText(e.currentTarget.value),
                  placeholder: strings.metadatasearchplaceholder ?? "Search attributes, values, tags..."
                },
                void 0,
                false,
                {
                  fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                  lineNumber: 106,
                  columnNumber: 25
                }
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 98,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "text-muted small", role: "status", children: [
          visibleEntries.length,
          " / ",
          entries.length
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 116,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 97,
        columnNumber: 17
      }),
      groupFacets.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(
          "select",
          {
            className: "form-select w-auto",
            "aria-label": strings.groupname,
            value: activeGroup,
            onChange: (event) => setActiveGroup(event.target.value),
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "", children: strings.allgroups }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                lineNumber: 125,
                columnNumber: 29
              }),
              activeGroup && !groupFacets.some((facet) => facet.name === activeGroup) && /* @__PURE__ */ jsxDEV("option", { value: activeGroup, children: [
                activeGroup,
                " (0)"
              ] }, void 0, true, {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                lineNumber: 127,
                columnNumber: 36
              }),
              groupFacets.map((facet) => /* @__PURE__ */ jsxDEV("option", { value: facet.name, children: [
                facet.name,
                " (",
                facet.count,
                ")"
              ] }, facet.name, true, {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                lineNumber: 128,
                columnNumber: 55
              }))
            ]
          },
          void 0,
          true,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 123,
            columnNumber: 25
          }
        ),
        (searchText || activeGroup) && /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-outline-secondary btn-sm",
            onClick: clearAll,
            children: strings.clearfilters
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 132,
            columnNumber: 57
          }
        )
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 122,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 69,
      columnNumber: 13
    }),
    visibleEntries.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "dd-empty", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "dd-empty-title", children: strings.emptymetadata ?? "No metadata matches your search" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 141,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("p", { className: "dd-empty-text", children: strings.emptymetadata_hint ?? "Try clearing active group filters or changing your search query." }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 142,
        columnNumber: 21
      }),
      (debouncedQuery || activeGroup) && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-primary btn-sm", onClick: clearAll, children: strings.clearfilters ?? "Clear all" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 146,
        columnNumber: 25
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 140,
      columnNumber: 17
    }) : viewMode === "cards" ? /* @__PURE__ */ jsxDEV("div", { className: "smu-meta-grid", children: groupedCards.map(([groupName, items]) => /* @__PURE__ */ jsxDEV("article", { className: "smu-card", children: [
      /* @__PURE__ */ jsxDEV("h3", { children: groupName }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 155,
        columnNumber: 29
      }),
      /* @__PURE__ */ jsxDEV("dl", { className: "dd-dl", children: items.map((item) => /* @__PURE__ */ jsxDEV("div", { style: { display: "contents" }, children: [
        /* @__PURE__ */ jsxDEV("dt", { title: item.key, children: item.label }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 159,
          columnNumber: 41
        }),
        /* @__PURE__ */ jsxDEV("dd", { children: /* @__PURE__ */ jsxDEV(MetadataValue, { entry: item }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 160,
          columnNumber: 45
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 160,
          columnNumber: 41
        })
      ] }, item.id, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 158,
        columnNumber: 37
      })) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 156,
        columnNumber: 29
      })
    ] }, groupName, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 154,
      columnNumber: 25
    })) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 152,
      columnNumber: 17
    }) : /* @__PURE__ */ jsxDEV("div", { className: "table-responsive smu-card", children: /* @__PURE__ */ jsxDEV("table", { className: "table table-hover align-middle mb-0", children: [
      /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden", children: strings.metadataheading }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 170,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: strings.groupname }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 173,
          columnNumber: 33
        }),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: strings.metadatatypes }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 174,
          columnNumber: 33
        }),
        /* @__PURE__ */ jsxDEV("th", { scope: "col", children: strings.metavalue }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 175,
          columnNumber: 33
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 172,
        columnNumber: 29
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 171,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("tbody", { children: pagedEntries.map((item) => /* @__PURE__ */ jsxDEV("tr", { children: [
        /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-light", children: item.group }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 181,
          columnNumber: 41
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 181,
          columnNumber: 37
        }),
        /* @__PURE__ */ jsxDEV("td", { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "fw-semibold", children: item.label }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 183,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "text-muted small", children: item.key }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 184,
            columnNumber: 41
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 182,
          columnNumber: 37
        }),
        /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV(MetadataValue, { entry: item }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 186,
          columnNumber: 41
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 186,
          columnNumber: 37
        })
      ] }, item.id, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 180,
        columnNumber: 33
      })) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 178,
        columnNumber: 25
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 169,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 168,
      columnNumber: 17
    }),
    visibleEntries.length > COLLAPSED_LIMIT && /* @__PURE__ */ jsxDEV("div", { className: "mt-3 text-center", children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: "btn btn-outline-secondary btn-sm",
        onClick: () => setShowAll((prev) => !prev),
        children: showAll ? strings.showless ?? "Show fewer" : (strings.showmore ?? `Show all (${visibleEntries.length})`).replace("{$a}", String(visibleEntries.length))
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 196,
        columnNumber: 21
      }
    ) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 195,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
    lineNumber: 68,
    columnNumber: 9
  });
}, "MetadataExplorer");
var MetadataExplorer_default = MetadataExplorer;
export {
  MetadataExplorer_default as default
};
//# sourceMappingURL=MetadataExplorer.dev.js.map
