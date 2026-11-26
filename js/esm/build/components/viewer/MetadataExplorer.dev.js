var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * High-volume metadata explorer with debounced search, group filter chips (dd-chips),
 * cards (dd-dl) / compact table switcher (dd-segmented), and JSON export.
 *
 * @module     mod_smarturl/components/viewer/MetadataExplorer
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useMemo, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { computeGroupFacets, filterByQuery, groupEntries } from "../../lib/metadata";
import MetadataValue from "./MetadataValue";
const COLLAPSED_LIMIT = 18;
const MetadataExplorer = /* @__PURE__ */ __name(({ entries, strings }) => {
  const [searchText, setSearchText] = useState("");
  const [activeGroup, setActiveGroup] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);
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
  const copyJson = /* @__PURE__ */ __name(() => {
    const payload = visibleEntries.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
        return null;
      }, () => null);
    }
  }, "copyJson");
  const clearAll = /* @__PURE__ */ __name(() => {
    setSearchText("");
    setActiveGroup("");
  }, "clearAll");
  return /* @__PURE__ */ jsxDEV("section", { "aria-labelledby": "smu-metadata-title", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "smu-meta-toolbar", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "smu-meta-toprow", children: [
        /* @__PURE__ */ jsxDEV("h2", { id: "smu-metadata-title", className: "h5 mb-0", children: strings.metadataheading ?? "Resource metadata" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 83,
          columnNumber: 21
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "dd-segmented", role: "group", "aria-label": "View mode", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                "aria-pressed": viewMode === "cards",
                onClick: () => setViewMode("cards"),
                children: strings.viewcards ?? "Grouped cards"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                lineNumber: 89,
                columnNumber: 29
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                "aria-pressed": viewMode === "table",
                onClick: () => setViewMode("table"),
                children: strings.viewtable ?? "Compact table"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                lineNumber: 96,
                columnNumber: 29
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 88,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary btn-sm", onClick: copyJson, children: copied ? strings.copied ?? "Copied" : strings.copyjson ?? "Copy JSON" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 105,
            columnNumber: 25
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 87,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 82,
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
                lineNumber: 117,
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
                  lineNumber: 120,
                  columnNumber: 25
                }
              )
            ]
          },
          void 0,
          true,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 112,
            columnNumber: 21
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "text-muted small", role: "status", children: [
          visibleEntries.length,
          " / ",
          entries.length
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 130,
          columnNumber: 21
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 111,
        columnNumber: 17
      }),
      groupFacets.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "dd-chips", role: "group", "aria-label": "Metadata groups", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "dd-chip",
            "aria-pressed": activeGroup === "",
            onClick: () => setActiveGroup(""),
            children: [
              strings.allgroups ?? "All",
              /* @__PURE__ */ jsxDEV("span", { className: "dd-chip-count", children: queryMatched.length }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                lineNumber: 144,
                columnNumber: 29
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 137,
            columnNumber: 25
          }
        ),
        groupFacets.map((facet) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "dd-chip",
            "aria-pressed": activeGroup === facet.name,
            onClick: () => setActiveGroup((prev) => prev === facet.name ? "" : facet.name),
            children: [
              facet.name,
              /* @__PURE__ */ jsxDEV("span", { className: "dd-chip-count", children: facet.count }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
                lineNumber: 155,
                columnNumber: 33
              })
            ]
          },
          facet.name,
          true,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 147,
            columnNumber: 29
          }
        ))
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 136,
        columnNumber: 21
      }),
      (debouncedQuery || activeGroup) && /* @__PURE__ */ jsxDEV("div", { className: "dd-chips", "aria-label": "Applied filters", children: [
        debouncedQuery && /* @__PURE__ */ jsxDEV("span", { className: "dd-chip dd-chip-applied", children: [
          "\u201C",
          debouncedQuery,
          "\u201D",
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "dd-chip-remove",
              "aria-label": "Clear search",
              onClick: () => setSearchText("")
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
              lineNumber: 166,
              columnNumber: 33
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 164,
          columnNumber: 29
        }),
        activeGroup && /* @__PURE__ */ jsxDEV("span", { className: "dd-chip dd-chip-applied", children: [
          activeGroup,
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "dd-chip-remove",
              "aria-label": `Remove ${activeGroup}`,
              onClick: () => setActiveGroup("")
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
              lineNumber: 177,
              columnNumber: 33
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 175,
          columnNumber: 29
        }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-link btn-sm", onClick: clearAll, children: strings.clearfilters ?? "Clear all" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 185,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 162,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 81,
      columnNumber: 13
    }),
    visibleEntries.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "dd-empty", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "dd-empty-title", children: strings.emptymetadata ?? "No metadata matches your search" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 194,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("p", { className: "dd-empty-text", children: strings.emptymetadata_hint ?? "Try clearing active group filters or changing your search query." }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 195,
        columnNumber: 21
      }),
      (debouncedQuery || activeGroup) && /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-primary btn-sm", onClick: clearAll, children: strings.clearfilters ?? "Clear all" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 199,
        columnNumber: 25
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 193,
      columnNumber: 17
    }) : viewMode === "cards" ? /* @__PURE__ */ jsxDEV("div", { className: "smu-meta-grid", children: groupedCards.map(([groupName, items]) => /* @__PURE__ */ jsxDEV("article", { className: "smu-card", children: [
      /* @__PURE__ */ jsxDEV("h3", { children: groupName }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 208,
        columnNumber: 29
      }),
      /* @__PURE__ */ jsxDEV("dl", { className: "dd-dl", children: items.map((item) => /* @__PURE__ */ jsxDEV("div", { style: { display: "contents" }, children: [
        /* @__PURE__ */ jsxDEV("dt", { title: item.key, children: item.label }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 212,
          columnNumber: 41
        }),
        /* @__PURE__ */ jsxDEV("dd", { children: /* @__PURE__ */ jsxDEV(MetadataValue, { entry: item }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 213,
          columnNumber: 45
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 213,
          columnNumber: 41
        })
      ] }, item.id, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 211,
        columnNumber: 37
      })) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 209,
        columnNumber: 29
      })
    ] }, groupName, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 207,
      columnNumber: 25
    })) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 205,
      columnNumber: 17
    }) : /* @__PURE__ */ jsxDEV("div", { className: "table-responsive smu-card", children: /* @__PURE__ */ jsxDEV("table", { className: "table table-hover align-middle mb-0", children: [
      /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
        /* @__PURE__ */ jsxDEV("th", { children: "Group" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 225,
          columnNumber: 33
        }),
        /* @__PURE__ */ jsxDEV("th", { children: "Attribute" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 226,
          columnNumber: 33
        }),
        /* @__PURE__ */ jsxDEV("th", { children: "Value" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 227,
          columnNumber: 33
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 224,
        columnNumber: 29
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 223,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("tbody", { children: pagedEntries.map((item) => /* @__PURE__ */ jsxDEV("tr", { children: [
        /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-light", children: item.group }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 233,
          columnNumber: 41
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 233,
          columnNumber: 37
        }),
        /* @__PURE__ */ jsxDEV("td", { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "fw-semibold", children: item.label }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 235,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "text-muted small", children: item.key }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
            lineNumber: 236,
            columnNumber: 41
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 234,
          columnNumber: 37
        }),
        /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV(MetadataValue, { entry: item }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 238,
          columnNumber: 41
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
          lineNumber: 238,
          columnNumber: 37
        })
      ] }, item.id, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 232,
        columnNumber: 33
      })) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
        lineNumber: 230,
        columnNumber: 25
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 222,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 221,
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
        lineNumber: 248,
        columnNumber: 21
      }
    ) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
      lineNumber: 247,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataExplorer.tsx",
    lineNumber: 80,
    columnNumber: 9
  });
}, "MetadataExplorer");
var MetadataExplorer_default = MetadataExplorer;
export {
  MetadataExplorer_default as default
};
//# sourceMappingURL=MetadataExplorer.dev.js.map
