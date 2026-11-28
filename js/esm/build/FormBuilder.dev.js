var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Dynamic single-row form builder for URL parameters and structured metadata in mod_form.
 *
 * @module     mod_smarturl/FormBuilder
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useMemo, useState } from "react";
const makeId = /* @__PURE__ */ __name(() => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, "makeId");
const createEmptyRow = /* @__PURE__ */ __name(() => ({
  id: makeId(),
  key: "",
  mode: "def",
  varName: "",
  customKey: "",
  value: ""
}), "createEmptyRow");
const FormBuilder = /* @__PURE__ */ __name(({ kind, initialRows, catalog, locked, strings }) => {
  const knownKeys = useMemo(() => new Set(catalog.map((c) => c.shortname)), [catalog]);
  const [rows, setRows] = useState(() => {
    if (!Array.isArray(initialRows) || initialRows.length === 0) {
      return [createEmptyRow()];
    }
    return initialRows.map((row) => {
      if (kind === "params") {
        const isStatic = (row.mode || "def") === "static";
        return {
          id: makeId(),
          key: row.param || "",
          mode: isStatic ? "static" : "def",
          varName: isStatic ? "__static__" : row.var || "",
          customKey: "",
          value: row.value || ""
        };
      }
      const rawKey = row.key || "";
      const isKnown = knownKeys.has(rawKey);
      return {
        id: makeId(),
        key: isKnown ? rawKey : "__custom__",
        mode: "meta",
        varName: "",
        customKey: isKnown ? "" : rawKey,
        value: row.value || ""
      };
    });
  });
  const [baseUrl, setBaseUrl] = useState(() => {
    const urlEl = document.getElementById("id_externalurl");
    return urlEl?.value ?? "";
  });
  useEffect(() => {
    if (kind !== "params") {
      return void 0;
    }
    const urlEl = document.getElementById("id_externalurl");
    if (!urlEl) {
      return void 0;
    }
    const onInput = /* @__PURE__ */ __name(() => setBaseUrl(urlEl.value), "onInput");
    urlEl.addEventListener("input", onInput);
    urlEl.addEventListener("change", onInput);
    return () => {
      urlEl.removeEventListener("input", onInput);
      urlEl.removeEventListener("change", onInput);
    };
  }, [kind]);
  const serialized = useMemo(() => {
    if (kind === "params") {
      return JSON.stringify(
        rows.filter((r) => r.key.trim() !== "" && (r.varName === "__static__" ? r.value.trim() !== "" : r.varName.trim() !== "")).map((r) => r.varName === "__static__" ? { param: r.key.trim(), mode: "static", var: "", value: r.value.trim() } : { param: r.key.trim(), mode: "def", var: r.varName.trim(), value: "" })
      );
    }
    return JSON.stringify(
      rows.map((r) => ({
        key: (r.key === "__custom__" ? r.customKey : r.key).trim(),
        value: r.value.trim()
      })).filter((r) => r.key !== "" && r.value !== "")
    );
  }, [kind, rows]);
  useEffect(() => {
    const targetName = kind === "params" ? "parameters_json" : "metadata_json";
    const hidden = document.querySelector(`input[name="${targetName}"]`);
    if (hidden) {
      hidden.value = serialized;
    }
  }, [kind, serialized]);
  const groupedMeta = useMemo(() => {
    const map = {};
    for (const item of catalog) {
      const g = item.group || "General";
      if (!map[g]) {
        map[g] = [];
      }
      map[g].push(item);
    }
    return Object.entries(map);
  }, [catalog]);
  const updateRow = /* @__PURE__ */ __name((id, patch) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, ...patch } : r));
  }, "updateRow");
  const insertRowAfter = /* @__PURE__ */ __name((id) => {
    if (locked) {
      return;
    }
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, createEmptyRow());
      return next;
    });
  }, "insertRowAfter");
  const removeRow = /* @__PURE__ */ __name((id) => {
    if (locked) {
      return;
    }
    setRows((prev) => prev.length <= 1 ? [createEmptyRow()] : prev.filter((r) => r.id !== id));
  }, "removeRow");
  const previewUrl = useMemo(() => {
    if (kind !== "params") {
      return "";
    }
    const active = rows.filter((r) => r.key.trim() !== "" && r.varName.trim() !== "");
    if (!baseUrl.trim() && active.length === 0) {
      return "";
    }
    const query = active.map((r) => {
      const val = r.varName === "__static__" ? r.value.trim() : `{${r.varName.trim()}}`;
      return `${encodeURIComponent(r.key.trim())}=${val}`;
    });
    if (query.length === 0) {
      return baseUrl;
    }
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl || "https://..."}${sep}${query.join("&")}`;
  }, [kind, baseUrl, rows]);
  return /* @__PURE__ */ jsxDEV("div", { className: "smu-form-builder", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "smu-builder-rows", children: rows.map((row) => {
      const metaDef = kind === "metadata" ? catalog.find((c) => c.shortname === row.key) : void 0;
      const showStatic = kind === "params" && row.varName === "__static__";
      const showCustomKey = kind === "metadata" && row.key === "__custom__";
      return /* @__PURE__ */ jsxDEV("div", { className: "smu-builder-row", children: [
        kind === "params" ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              className: "form-control smu-builder-input",
              "aria-label": strings.paramqueryname,
              placeholder: strings.paramqueryname ?? "Parameter name (e.g. uid)",
              value: row.key,
              disabled: locked,
              onChange: (e) => updateRow(row.id, { key: e.target.value })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 202,
              columnNumber: 37
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              className: "form-select smu-builder-select",
              "aria-label": strings.paramchoose,
              value: row.varName,
              disabled: locked,
              onChange: (e) => {
                const nextVar = e.target.value;
                const matched = catalog.find((c) => c.shortname === nextVar);
                updateRow(row.id, {
                  varName: nextVar,
                  key: row.key || matched?.default_query_param || ""
                });
              },
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "", children: strings.paramchoose ?? "Choose variable..." }, void 0, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 225,
                  columnNumber: 41
                }),
                catalog.map((def) => /* @__PURE__ */ jsxDEV("option", { value: def.shortname, children: [
                  def.name,
                  " (",
                  def.shortname,
                  ")"
                ] }, def.shortname, true, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 227,
                  columnNumber: 45
                })),
                /* @__PURE__ */ jsxDEV("option", { value: "__static__", children: strings.paramstatic ?? "Custom fixed value" }, void 0, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 231,
                  columnNumber: 41
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 211,
              columnNumber: 37
            }
          ),
          showStatic && /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              className: "form-control smu-builder-input",
              "aria-label": strings.paramstatic,
              placeholder: strings.paramstatic ?? "Fixed value",
              value: row.value,
              disabled: locked,
              onChange: (e) => updateRow(row.id, { value: e.target.value })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 234,
              columnNumber: 41
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
          lineNumber: 201,
          columnNumber: 33
        }) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(
            "select",
            {
              className: "form-select smu-builder-select",
              "aria-label": strings.choose,
              value: row.key,
              disabled: locked,
              onChange: (e) => updateRow(row.id, { key: e.target.value }),
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "", children: strings.choose ?? "Choose metadata field..." }, void 0, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 254,
                  columnNumber: 41
                }),
                groupedMeta.map(([group, items]) => /* @__PURE__ */ jsxDEV("optgroup", { label: group, children: items.map((mt) => /* @__PURE__ */ jsxDEV("option", { value: mt.shortname, children: mt.name }, mt.shortname, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 258,
                  columnNumber: 53
                })) }, group, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 256,
                  columnNumber: 45
                })),
                /* @__PURE__ */ jsxDEV("option", { value: "__custom__", children: strings.customkey ?? "Custom field name..." }, void 0, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 264,
                  columnNumber: 41
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 247,
              columnNumber: 37
            }
          ),
          showCustomKey && /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              className: "form-control smu-builder-input",
              "aria-label": strings.customkey,
              placeholder: strings.customkey ?? "custom_key",
              value: row.customKey,
              disabled: locked,
              onChange: (e) => updateRow(row.id, { customKey: e.target.value })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 267,
              columnNumber: 41
            }
          ),
          metaDef?.datatype === "BOOLEAN" ? /* @__PURE__ */ jsxDEV(
            "select",
            {
              className: "form-select smu-builder-select",
              "aria-label": strings.metavalue,
              disabled: locked,
              value: row.value,
              onChange: (e) => updateRow(row.id, { value: e.target.value }),
              children: [
                /* @__PURE__ */ jsxDEV("option", { value: "", children: strings.metavalue }, void 0, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 280,
                  columnNumber: 45
                }),
                /* @__PURE__ */ jsxDEV("option", { value: "1", children: strings.yes }, void 0, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 281,
                  columnNumber: 45
                }),
                /* @__PURE__ */ jsxDEV("option", { value: "0", children: strings.no }, void 0, false, {
                  fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                  lineNumber: 282,
                  columnNumber: 45
                })
              ]
            },
            void 0,
            true,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 278,
              columnNumber: 41
            }
          ) : metaDef?.datatype === "MULTILINE" ? /* @__PURE__ */ jsxDEV(
            "textarea",
            {
              className: "form-control smu-builder-val",
              "aria-label": strings.metavalue,
              disabled: locked,
              value: row.value,
              onChange: (e) => updateRow(row.id, { value: e.target.value })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 285,
              columnNumber: 41
            }
          ) : /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: metaDef?.datatype === "DATE" ? "date" : metaDef?.datatype === "NUMBER" ? "number" : "text",
              step: "any",
              className: "form-control smu-builder-input smu-builder-val",
              "aria-label": strings.metavalue,
              placeholder: strings.metavalue,
              value: row.value,
              disabled: locked,
              onChange: (e) => updateRow(row.id, { value: e.target.value })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 288,
              columnNumber: 41
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
          lineNumber: 246,
          columnNumber: 33
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "smu-row-actions", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "btn btn-outline-secondary smu-iconpill tone-primary",
              disabled: locked,
              "aria-label": strings.addrow ?? "Add row",
              title: strings.addrow ?? "Add row",
              onClick: () => insertRowAfter(row.id),
              children: /* @__PURE__ */ jsxDEV("i", { className: "fa fa-plus", "aria-hidden": "true" }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                lineNumber: 305,
                columnNumber: 37
              })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 297,
              columnNumber: 33
            }
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "btn btn-outline-secondary smu-iconpill tone-danger",
              disabled: locked,
              "aria-label": strings.removerow ?? "Remove row",
              title: strings.removerow ?? "Remove row",
              onClick: () => removeRow(row.id),
              children: /* @__PURE__ */ jsxDEV("i", { className: "fa fa-trash", "aria-hidden": "true" }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
                lineNumber: 315,
                columnNumber: 37
              })
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
              lineNumber: 307,
              columnNumber: 33
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
          lineNumber: 296,
          columnNumber: 29
        })
      ] }, row.id, true, {
        fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
        lineNumber: 199,
        columnNumber: 25
      });
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
      lineNumber: 192,
      columnNumber: 13
    }),
    kind === "params" && previewUrl && /* @__PURE__ */ jsxDEV("div", { className: "smu-live-preview", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "smu-live-preview-label", children: strings.previewlabel ?? "Resolved URL preview:" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
        lineNumber: 325,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("code", { children: previewUrl }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
        lineNumber: 326,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
      lineNumber: 324,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/FormBuilder.tsx",
    lineNumber: 190,
    columnNumber: 9
  });
}, "FormBuilder");
var FormBuilder_default = FormBuilder;
export {
  FormBuilder_default as default
};
//# sourceMappingURL=FormBuilder.dev.js.map
