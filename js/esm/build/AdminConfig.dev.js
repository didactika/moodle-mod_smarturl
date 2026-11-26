var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Didactika schema & dynamic URL parameter studio mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/AdminConfig
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useState } from "react";
import PageHeader from "./components/common/PageHeader";
import * as api from "./services/api";
const AdminConfig = /* @__PURE__ */ __name((props) => {
  const [tab, setTab] = useState("meta");
  const [metaTypes, setMetaTypes] = useState(props.metaTypes);
  const [paramDefs, setParamDefs] = useState(props.paramDefs);
  const [errorMsg, setErrorMsg] = useState(null);
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [page, setPage] = useState(0);
  const perPage = 20;
  const matches = /* @__PURE__ */ __name((items) => items.filter((item) => [item.name, item.shortname].some((value) => value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))), "matches");
  const filteredFields = matches(metaTypes);
  const filteredVariables = matches(paramDefs);
  const count = tab === "meta" ? filteredFields.length : filteredVariables.length;
  const offset = Math.min(page * perPage, Math.max(0, Math.floor((count - 1) / perPage) * perPage));
  const [mtForm, setMtForm] = useState({
    id: 0,
    shortname: "",
    name: "",
    categoryid: props.categories[0]?.id ?? 0,
    datatype: "TEXT",
    display_priority: "SECONDARY",
    searchable: true,
    filterable: true,
    enabled: true
  });
  const [pdForm, setPdForm] = useState({
    id: 0,
    shortname: "",
    name: "",
    source_type: "BUILTIN",
    source_key: "",
    default_query_param: "",
    enabled: true
  });
  const [testTemplate, setTestTemplate] = useState("https://cdn.example.org/watch/{{course_shortname}}?u={{user_username}}");
  const [testResult, setTestResult] = useState(null);
  const submitMetaType = /* @__PURE__ */ __name((e) => {
    e.preventDefault();
    setErrorMsg(null);
    api.saveMetaType(mtForm).then((saved) => {
      setMetaTypes((prev) => {
        const rest = prev.filter((item) => item.id !== saved.id);
        return [...rest, saved];
      });
      setMtForm({
        id: 0,
        shortname: "",
        name: "",
        categoryid: props.categories[0]?.id ?? 0,
        datatype: "TEXT",
        display_priority: "SECONDARY",
        searchable: true,
        filterable: true,
        enabled: true
      });
      return null;
    }, (err) => {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save metadata type");
      return null;
    });
  }, "submitMetaType");
  const removeMetaType = /* @__PURE__ */ __name((id) => {
    api.deleteMetaType(id).then(() => {
      setMetaTypes((prev) => prev.filter((item) => item.id !== id));
      return null;
    }, () => {
      setErrorMsg(props.strings.savefailed);
      return null;
    });
  }, "removeMetaType");
  const submitParamDef = /* @__PURE__ */ __name((e) => {
    e.preventDefault();
    setErrorMsg(null);
    api.saveParamDef(pdForm).then((saved) => {
      setParamDefs((prev) => {
        const rest = prev.filter((item) => item.id !== saved.id);
        return [...rest, saved];
      });
      setPdForm({
        id: 0,
        shortname: "",
        name: "",
        source_type: "BUILTIN",
        source_key: "",
        default_query_param: "",
        enabled: true
      });
      return null;
    }, (err) => {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save parameter definition");
      return null;
    });
  }, "submitParamDef");
  const removeParamDef = /* @__PURE__ */ __name((id) => {
    api.deleteParamDef(id).then(() => {
      setParamDefs((prev) => prev.filter((item) => item.id !== id));
      return null;
    }, () => {
      setErrorMsg(props.strings.savefailed);
      return null;
    });
  }, "removeParamDef");
  const runPreview = /* @__PURE__ */ __name(() => {
    const bindings = paramDefs.filter((pd) => pd.enabled && pd.default_query_param).slice(0, 4).map((pd) => ({
      param: pd.default_query_param ?? "",
      mode: "def",
      var: pd.shortname,
      value: ""
    }));
    api.previewUrl(testTemplate, 1, bindings).then((res) => {
      setTestResult(res.resolved);
      return null;
    }, () => {
      setErrorMsg(props.strings.savefailed);
      return null;
    });
  }, "runPreview");
  return /* @__PURE__ */ jsxDEV("div", { className: "smu-admin-layout", children: [
    pendingDelete && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-warning", role: "alert", children: [
      /* @__PURE__ */ jsxDEV("p", { children: props.strings.confirmdelete.replace("{$a}", pendingDelete.name) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 144,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("button", { className: "btn btn-danger me-2", type: "button", onClick: () => {
        if (pendingDelete.tab === "meta") {
          removeMetaType(pendingDelete.id);
        } else {
          removeParamDef(pendingDelete.id);
        }
        setPendingDelete(null);
      }, children: props.strings.delete }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 145,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("button", { className: "btn btn-outline-secondary", type: "button", onClick: () => setPendingDelete(null), children: props.strings.cancel }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 149,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 143,
      columnNumber: 31
    }),
    /* @__PURE__ */ jsxDEV(
      PageHeader,
      {
        title: props.title,
        subtitle: props.subtitle,
        iconLabel: "",
        actions: /* @__PURE__ */ jsxDEV("a", { href: props.settingsUrl, className: "btn btn-outline-secondary", children: props.strings.settings }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 158,
          columnNumber: 21
        })
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 153,
        columnNumber: 13
      }
    ),
    errorMsg && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-danger", children: errorMsg }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 164,
      columnNumber: 26
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "nav nav-tabs", role: "group", children: [
      /* @__PURE__ */ jsxDEV("button", { type: "button", "aria-pressed": tab === "meta", className: tab === "meta" ? "nav-link active" : "nav-link", onClick: () => {
        setTab("meta");
        setPage(0);
      }, children: [
        props.strings.metadatatypes ?? "Metadata types",
        " (",
        metaTypes.length,
        ")"
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 167,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("button", { type: "button", "aria-pressed": tab === "params", className: tab === "params" ? "nav-link active" : "nav-link", onClick: () => {
        setTab("params");
        setPage(0);
      }, children: [
        props.strings.paramdefs ?? "Dynamic URL parameters",
        " (",
        paramDefs.length,
        ")"
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 170,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 166,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "table-toolbar d-flex flex-wrap gap-2", role: "search", children: [
      /* @__PURE__ */ jsxDEV(
        "input",
        {
          className: "form-control w-auto",
          type: "search",
          value: query,
          "aria-label": props.strings.search,
          placeholder: props.strings.search,
          onChange: (event) => {
            setQuery(event.target.value);
            setPage(0);
          }
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 176,
          columnNumber: 17
        }
      ),
      /* @__PURE__ */ jsxDEV("button", { className: "btn btn-outline-secondary", type: "button", onClick: () => {
        setQuery("");
        setPage(0);
      }, children: props.strings.clearfilters }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 178,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("span", { className: "align-self-center text-muted", role: "status", children: count || props.strings.emptyresults }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 181,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 175,
      columnNumber: 13
    }),
    tab === "meta" ? /* @__PURE__ */ jsxDEV("div", { className: "d-grid gap-3", children: [
      /* @__PURE__ */ jsxDEV("form", { className: "smu-card", onSubmit: submitMetaType, children: [
        /* @__PURE__ */ jsxDEV("h3", { children: props.strings.addmetatype ?? "Add metadata type" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 187,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "smu-form-grid", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.shortname ?? "Shortname" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 190,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                className: "form-control",
                required: true,
                value: mtForm.shortname,
                onChange: (e) => setMtForm({ ...mtForm, shortname: e.currentTarget.value }),
                placeholder: "curriculum_code"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 191,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 189,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.name }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 200,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                className: "form-control",
                required: true,
                value: mtForm.name,
                onChange: (e) => setMtForm({ ...mtForm, name: e.currentTarget.value }),
                placeholder: "Curriculum code"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 201,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 199,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.groupname ?? "Group" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 210,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                className: "form-select",
                value: mtForm.categoryid,
                onChange: (event) => setMtForm({ ...mtForm, categoryid: Number(event.target.value) }),
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: 0, children: props.strings.groupname }, void 0, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                    lineNumber: 213,
                    columnNumber: 37
                  }),
                  props.categories.map((category) => /* @__PURE__ */ jsxDEV("option", { value: category.id, children: category.name }, category.id, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                    lineNumber: 215,
                    columnNumber: 41
                  }))
                ]
              },
              void 0,
              true,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 211,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 209,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.datatype ?? "Data type" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 219,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                className: "form-select",
                value: mtForm.datatype,
                onChange: (e) => setMtForm({ ...mtForm, datatype: e.currentTarget.value }),
                children: props.datatypes.map((dt) => /* @__PURE__ */ jsxDEV("option", { value: dt, children: dt }, dt, false, {
                  fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                  lineNumber: 225,
                  columnNumber: 66
                }))
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 220,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 218,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.priority ?? "Priority" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 229,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                className: "form-select",
                value: mtForm.display_priority,
                onChange: (e) => setMtForm({ ...mtForm, display_priority: e.currentTarget.value }),
                children: props.priorities.map((pr) => /* @__PURE__ */ jsxDEV("option", { value: pr, children: pr }, pr, false, {
                  fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                  lineNumber: 235,
                  columnNumber: 67
                }))
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 230,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 228,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 188,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap gap-3 mt-3 align-items-center", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "form-check-label d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "checkbox",
                className: "form-check-input",
                checked: mtForm.searchable,
                onChange: (e) => setMtForm({ ...mtForm, searchable: e.currentTarget.checked })
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 241,
                columnNumber: 33
              }
            ),
            props.strings.searchable ?? "Searchable"
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 240,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("label", { className: "form-check-label d-flex align-items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "checkbox",
                className: "form-check-input",
                checked: mtForm.filterable,
                onChange: (e) => setMtForm({ ...mtForm, filterable: e.currentTarget.checked })
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 250,
                columnNumber: 33
              }
            ),
            props.strings.filterable ?? "Filterable"
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 249,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "btn btn-primary ms-auto", children: props.strings.savechanges ?? "Save changes" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 258,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 239,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 186,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "card table-responsive", "data-region": "tablewrap", children: /* @__PURE__ */ jsxDEV("table", { className: "table table-hover align-middle mb-0", children: [
        /* @__PURE__ */ jsxDEV("caption", { className: "visually-hidden", children: props.strings.metadatatypes }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 266,
          columnNumber: 29
        }),
        /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: props.strings.shortname ?? "Shortname" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 269,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: "Name" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 270,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: props.strings.groupname ?? "Group" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 271,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: props.strings.datatype ?? "Data type" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 272,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: props.strings.priority ?? "Priority" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 273,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", "aria-label": props.strings.edit }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 274,
            columnNumber: 37
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 268,
          columnNumber: 33
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 267,
          columnNumber: 29
        }),
        /* @__PURE__ */ jsxDEV("tbody", { children: filteredFields.slice(offset, offset + perPage).map((mt) => /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("code", { children: mt.shortname }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 280,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 280,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: mt.name }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 281,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-light", children: mt.group_name }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 282,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 282,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-secondary", children: mt.datatype }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 283,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 283,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: mt.display_priority }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 284,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { className: "text-end", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                className: "btn btn-outline-secondary btn-sm me-1",
                onClick: () => setMtForm({
                  id: mt.id,
                  shortname: mt.shortname,
                  name: mt.name,
                  categoryid: mt.categoryid ?? 0,
                  datatype: mt.datatype,
                  display_priority: mt.display_priority,
                  searchable: Boolean(mt.searchable),
                  filterable: Boolean(mt.filterable),
                  enabled: Boolean(mt.enabled)
                }),
                children: props.strings.edit ?? "Edit"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 286,
                columnNumber: 45
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                className: "btn btn-outline-danger btn-sm",
                onClick: () => setPendingDelete({ ...mt, tab: "meta" }),
                children: props.strings.delete ?? "Delete"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 303,
                columnNumber: 45
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 285,
            columnNumber: 41
          })
        ] }, mt.id, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 279,
          columnNumber: 37
        })) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 277,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 265,
        columnNumber: 25
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 264,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 185,
      columnNumber: 17
    }) : /* @__PURE__ */ jsxDEV("div", { className: "d-grid gap-3", children: [
      /* @__PURE__ */ jsxDEV("form", { className: "smu-card", onSubmit: submitParamDef, children: [
        /* @__PURE__ */ jsxDEV("h3", { children: props.strings.addparamdef ?? "Add dynamic parameter" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 320,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "smu-form-grid", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.shortname ?? "Shortname" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 323,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                className: "form-control",
                required: true,
                value: pdForm.shortname,
                onChange: (e) => setPdForm({ ...pdForm, shortname: e.currentTarget.value }),
                placeholder: "campus_code"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 324,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 322,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: "Name" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 333,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                className: "form-control",
                required: true,
                value: pdForm.name,
                onChange: (e) => setPdForm({ ...pdForm, name: e.currentTarget.value }),
                placeholder: "Campus profile field"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 334,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 332,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.sourcetype ?? "Source type" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 343,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                className: "form-select",
                value: pdForm.source_type,
                onChange: (e) => setPdForm({ ...pdForm, source_type: e.currentTarget.value, source_key: "" }),
                children: props.sourceTypes.map((st) => /* @__PURE__ */ jsxDEV("option", { value: st, children: st }, st, false, {
                  fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                  lineNumber: 349,
                  columnNumber: 68
                }))
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 344,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 342,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.sourcekey ?? "Source key / value" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 353,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                className: "form-control",
                required: true,
                value: pdForm.source_key,
                onChange: (e) => setPdForm({ ...pdForm, source_key: e.currentTarget.value }),
                placeholder: "user.username or profile_shortname"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 354,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 352,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.defaultqueryparam ?? "Suggested query param" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 363,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                className: "form-control",
                value: pdForm.default_query_param,
                onChange: (e) => setPdForm({ ...pdForm, default_query_param: e.currentTarget.value }),
                placeholder: "campus"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 364,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 362,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 321,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-3 text-end", children: /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "btn btn-primary", children: props.strings.savechanges ?? "Save changes" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 373,
          columnNumber: 29
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 372,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 319,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-card", children: [
        /* @__PURE__ */ jsxDEV("h3", { children: props.strings.testresolution ?? "Test URL resolution" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 380,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              className: "form-control flex-grow-1",
              value: testTemplate,
              onChange: (e) => setTestTemplate(e.currentTarget.value)
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 382,
              columnNumber: 29
            }
          ),
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-primary", onClick: runPreview, children: props.strings.testresolution ?? "Test URL resolution" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 387,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 381,
          columnNumber: 25
        }),
        testResult !== null && /* @__PURE__ */ jsxDEV("div", { className: "smu-preview-box mt-2", children: testResult }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 392,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 379,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "card table-responsive", "data-region": "tablewrap", children: /* @__PURE__ */ jsxDEV("table", { className: "table table-hover align-middle mb-0", children: [
        /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: props.strings.shortname ?? "Shortname" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 400,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: "Name" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 401,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: props.strings.sourcetype ?? "Source type" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 402,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: props.strings.sourcekey ?? "Source key" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 403,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", children: props.strings.defaultqueryparam ?? "Query param" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 404,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { scope: "col", "aria-label": props.strings.edit }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 405,
            columnNumber: 37
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 399,
          columnNumber: 33
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 398,
          columnNumber: 29
        }),
        /* @__PURE__ */ jsxDEV("tbody", { children: filteredVariables.slice(offset, offset + perPage).map((pd) => /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("code", { children: `{{${pd.shortname}}}` }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 411,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 411,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: pd.name }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 412,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-light", children: pd.source_type }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 413,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 413,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("code", { children: pd.source_key }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 414,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 414,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: pd.default_query_param ?? "\u2014" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 415,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { className: "text-end", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                className: "btn btn-outline-secondary btn-sm me-1",
                onClick: () => setPdForm({
                  id: pd.id,
                  shortname: pd.shortname,
                  name: pd.name,
                  source_type: pd.source_type,
                  source_key: pd.source_key,
                  default_query_param: pd.default_query_param ?? "",
                  enabled: Boolean(pd.enabled)
                }),
                children: props.strings.edit ?? "Edit"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 417,
                columnNumber: 45
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                className: "btn btn-outline-danger btn-sm",
                onClick: () => setPendingDelete({ ...pd, tab: "params" }),
                children: props.strings.delete ?? "Delete"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 432,
                columnNumber: 45
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 416,
            columnNumber: 41
          })
        ] }, pd.id, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 410,
          columnNumber: 37
        })) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 408,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 397,
        columnNumber: 25
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 396,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 318,
      columnNumber: 17
    }),
    count > perPage && /* @__PURE__ */ jsxDEV("div", { className: "table-foot d-flex justify-content-end align-items-center gap-2", children: [
      /* @__PURE__ */ jsxDEV("span", { role: "status", children: [
        offset + 1,
        "\u2013",
        Math.min(offset + perPage, count),
        " / ",
        count
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 448,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: "btn btn-outline-secondary",
          type: "button",
          disabled: !offset,
          onClick: () => setPage(Math.floor(offset / perPage) - 1),
          "aria-label": props.strings.previous,
          children: "\u2039"
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 449,
          columnNumber: 17
        }
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: "btn btn-outline-secondary",
          type: "button",
          disabled: offset + perPage >= count,
          onClick: () => setPage(Math.floor(offset / perPage) + 1),
          "aria-label": props.strings.next,
          children: "\u203A"
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 451,
          columnNumber: 17
        }
      )
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 447,
      columnNumber: 33
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
    lineNumber: 142,
    columnNumber: 9
  });
}, "AdminConfig");
var AdminConfig_default = AdminConfig;
export {
  AdminConfig_default as default
};
//# sourceMappingURL=AdminConfig.dev.js.map
