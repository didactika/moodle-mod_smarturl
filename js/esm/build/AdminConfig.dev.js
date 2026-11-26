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
  const [mtForm, setMtForm] = useState({
    id: 0,
    shortname: "",
    name: "",
    group_name: "General",
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
        group_name: "General",
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
    }, () => null);
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
    }, () => null);
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
    }, () => null);
  }, "runPreview");
  return /* @__PURE__ */ jsxDEV("div", { className: "smu-admin-layout", children: [
    /* @__PURE__ */ jsxDEV(
      PageHeader,
      {
        title: props.title,
        subtitle: props.subtitle,
        iconLabel: "CFG",
        actions: /* @__PURE__ */ jsxDEV("a", { href: props.settingsUrl, className: "btn btn-outline-secondary", children: "Plugin settings" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 138,
          columnNumber: 21
        })
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 133,
        columnNumber: 13
      }
    ),
    errorMsg && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-danger", children: errorMsg }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 144,
      columnNumber: 26
    }),
    /* @__PURE__ */ jsxDEV("div", { className: "dd-segmented", role: "tablist", children: [
      /* @__PURE__ */ jsxDEV("button", { type: "button", "aria-pressed": tab === "meta", onClick: () => setTab("meta"), children: [
        props.strings.metadatatypes ?? "Metadata types",
        " (",
        metaTypes.length,
        ")"
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 147,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV("button", { type: "button", "aria-pressed": tab === "params", onClick: () => setTab("params"), children: [
        props.strings.paramdefs ?? "Dynamic URL parameters",
        " (",
        paramDefs.length,
        ")"
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 150,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 146,
      columnNumber: 13
    }),
    tab === "meta" ? /* @__PURE__ */ jsxDEV("div", { className: "d-grid gap-3", children: [
      /* @__PURE__ */ jsxDEV("form", { className: "smu-card", onSubmit: submitMetaType, children: [
        /* @__PURE__ */ jsxDEV("h3", { children: props.strings.addmetatype ?? "Add metadata type" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 158,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "smu-form-grid", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.shortname ?? "Shortname" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 161,
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
                lineNumber: 162,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 160,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: "Name" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 171,
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
                lineNumber: 172,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 170,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.groupname ?? "Group" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 181,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                className: "form-control",
                value: mtForm.group_name,
                onChange: (e) => setMtForm({ ...mtForm, group_name: e.currentTarget.value }),
                placeholder: "Academic"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 182,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 180,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.datatype ?? "Data type" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 190,
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
                  lineNumber: 196,
                  columnNumber: 66
                }))
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
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.priority ?? "Priority" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 200,
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
                  lineNumber: 206,
                  columnNumber: 67
                }))
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
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 159,
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
                lineNumber: 212,
                columnNumber: 33
              }
            ),
            props.strings.searchable ?? "Searchable"
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 211,
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
                lineNumber: 221,
                columnNumber: 33
              }
            ),
            props.strings.filterable ?? "Filterable"
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 220,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "btn btn-primary ms-auto", children: props.strings.savechanges ?? "Save changes" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 229,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 210,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 157,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-card table-responsive", children: /* @__PURE__ */ jsxDEV("table", { className: "table table-hover align-middle mb-0", children: [
        /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("th", { children: props.strings.shortname ?? "Shortname" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 239,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { children: "Name" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 240,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { children: props.strings.groupname ?? "Group" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 241,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { children: props.strings.datatype ?? "Data type" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 242,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { children: props.strings.priority ?? "Priority" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 243,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", {}, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 244,
            columnNumber: 37
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 238,
          columnNumber: 33
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 237,
          columnNumber: 29
        }),
        /* @__PURE__ */ jsxDEV("tbody", { children: metaTypes.map((mt) => /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("code", { children: mt.shortname }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 250,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 250,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: mt.name }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 251,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-light", children: mt.group_name }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 252,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 252,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-secondary", children: mt.datatype }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 253,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 253,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: mt.display_priority }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 254,
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
                  group_name: mt.group_name,
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
                lineNumber: 256,
                columnNumber: 45
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                className: "btn btn-outline-danger btn-sm",
                onClick: () => removeMetaType(mt.id),
                children: props.strings.delete ?? "Delete"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 273,
                columnNumber: 45
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 255,
            columnNumber: 41
          })
        ] }, mt.id, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 249,
          columnNumber: 37
        })) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 247,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 236,
        columnNumber: 25
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 235,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 156,
      columnNumber: 17
    }) : /* @__PURE__ */ jsxDEV("div", { className: "d-grid gap-3", children: [
      /* @__PURE__ */ jsxDEV("form", { className: "smu-card", onSubmit: submitParamDef, children: [
        /* @__PURE__ */ jsxDEV("h3", { children: props.strings.addparamdef ?? "Add dynamic parameter" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 290,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "smu-form-grid", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.shortname ?? "Shortname" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 293,
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
                lineNumber: 294,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 292,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: "Name" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 303,
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
                lineNumber: 304,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 302,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.sourcetype ?? "Source type" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 313,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                className: "form-select",
                value: pdForm.source_type,
                onChange: (e) => setPdForm({ ...pdForm, source_type: e.currentTarget.value }),
                children: props.sourceTypes.map((st) => /* @__PURE__ */ jsxDEV("option", { value: st, children: st }, st, false, {
                  fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                  lineNumber: 319,
                  columnNumber: 68
                }))
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 314,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 312,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.sourcekey ?? "Source key / value" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 323,
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
            /* @__PURE__ */ jsxDEV("label", { className: "form-label", children: props.strings.defaultqueryparam ?? "Suggested query param" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 333,
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
                lineNumber: 334,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 332,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 291,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "mt-3 text-end", children: /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "btn btn-primary", children: props.strings.savechanges ?? "Save changes" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 343,
          columnNumber: 29
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 342,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 289,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-card", children: [
        /* @__PURE__ */ jsxDEV("h3", { children: props.strings.testresolution ?? "Test URL resolution" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 350,
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
              lineNumber: 352,
              columnNumber: 29
            }
          ),
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-primary", onClick: runPreview, children: props.strings.testresolution ?? "Test URL resolution" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 357,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 351,
          columnNumber: 25
        }),
        testResult !== null && /* @__PURE__ */ jsxDEV("div", { className: "smu-preview-box mt-2", children: testResult }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 362,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 349,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-card table-responsive", children: /* @__PURE__ */ jsxDEV("table", { className: "table table-hover align-middle mb-0", children: [
        /* @__PURE__ */ jsxDEV("thead", { children: /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("th", { children: props.strings.shortname ?? "Shortname" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 370,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { children: "Name" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 371,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { children: props.strings.sourcetype ?? "Source type" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 372,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { children: props.strings.sourcekey ?? "Source key" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 373,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", { children: props.strings.defaultqueryparam ?? "Query param" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 374,
            columnNumber: 37
          }),
          /* @__PURE__ */ jsxDEV("th", {}, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 375,
            columnNumber: 37
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 369,
          columnNumber: 33
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 368,
          columnNumber: 29
        }),
        /* @__PURE__ */ jsxDEV("tbody", { children: paramDefs.map((pd) => /* @__PURE__ */ jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("code", { children: `{{${pd.shortname}}}` }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 381,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 381,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: pd.name }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 382,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-light", children: pd.source_type }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 383,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 383,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: /* @__PURE__ */ jsxDEV("code", { children: pd.source_key }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 384,
            columnNumber: 45
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 384,
            columnNumber: 41
          }),
          /* @__PURE__ */ jsxDEV("td", { children: pd.default_query_param ?? "\u2014" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 385,
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
                lineNumber: 387,
                columnNumber: 45
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                className: "btn btn-outline-danger btn-sm",
                onClick: () => removeParamDef(pd.id),
                children: props.strings.delete ?? "Delete"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
                lineNumber: 402,
                columnNumber: 45
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 386,
            columnNumber: 41
          })
        ] }, pd.id, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 380,
          columnNumber: 37
        })) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 378,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 367,
        columnNumber: 25
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 366,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 288,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
    lineNumber: 132,
    columnNumber: 9
  });
}, "AdminConfig");
var AdminConfig_default = AdminConfig;
export {
  AdminConfig_default as default
};
//# sourceMappingURL=AdminConfig.dev.js.map
