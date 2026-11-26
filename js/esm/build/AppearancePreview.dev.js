var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
const presets = {
  video: ["CARD", "VIEWERTAB", "POSTER"],
  document: ["CARD", "ACTIVITY", "EMBED"],
  weblink: ["LINK", "EXTERNAL", "LINK"]
};
const AppearancePreview = /* @__PURE__ */ __name((props) => {
  const trigger = useRef(null);
  const dialog = useRef(null);
  const iframe = useRef(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [surface, setSurface] = useState("course");
  const [language, setLanguage] = useState("");
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (!open || !dialog.current) {
      return void 0;
    }
    const node = dialog.current;
    node.showModal();
    return () => {
      node.close();
      trigger.current?.focus();
    };
  }, [open]);
  useEffect(() => {
    const editor = trigger.current?.closest("form");
    if (!open || !editor || !iframe.current) {
      return;
    }
    const tiny = window.tinymce;
    tiny?.triggerSave();
    const draft = {};
    for (const [name, value] of new FormData(editor)) {
      if (name.startsWith("smu_") && name.endsWith("[]")) {
        const key = name.slice(0, -2);
        draft[key] = [...Array.isArray(draft[key]) ? draft[key] : [], value];
      } else if (name.startsWith("smu_") || [
        "name",
        "externalurl",
        "parameters_json",
        "metadata_json",
        "thumbnail_url",
        "poster_filemanager",
        "aspect_ratio",
        "introeditor[text]",
        "introeditor[format]"
      ].includes(name)) {
        draft[name] = value;
      }
    }
    const form = document.createElement("form");
    form.method = "post";
    form.action = props.url;
    form.target = iframe.current.name;
    form.hidden = true;
    const values = {
      draft: JSON.stringify(draft),
      surface,
      language,
      sesskey: props.sesskey,
      courseid: props.courseid,
      cmid: props.cmid
    };
    for (const [key, value] of Object.entries(values)) {
      const field = document.createElement("input");
      field.type = "hidden";
      field.name = key;
      field.value = String(value);
      form.append(field);
    }
    document.body.append(form);
    form.submit();
    form.remove();
  }, [open, surface, language, props.url, props.courseid, props.cmid, props.sesskey]);
  useEffect(() => {
    const editor = trigger.current?.closest("form");
    const catalogue = editor?.querySelector('[name="smu_catalogue"]');
    const link = editor?.querySelector('[name="externalurl"]');
    if (!catalogue || !link) {
      return void 0;
    }
    const choose = /* @__PURE__ */ __name(() => {
      if (catalogue.value) {
        link.value = catalogue.value;
        link.dispatchEvent(new Event("input", { bubbles: true }));
        const title = editor?.querySelector('[name="name"]');
        if (title && !title.value) {
          title.value = catalogue.selectedOptions[0]?.textContent?.trim() ?? "";
        }
      }
    }, "choose");
    catalogue.addEventListener("change", choose);
    return () => catalogue.removeEventListener("change", choose);
  }, []);
  useEffect(() => {
    const form = trigger.current?.closest("form");
    if (!form) {
      return void 0;
    }
    const field = /* @__PURE__ */ __name((name) => form.querySelector('[name="' + name + '"]'), "field");
    const refresh = /* @__PURE__ */ __name(() => {
      const course = field("smu_course")?.value;
      const launch = field("smu_launch")?.value ?? "";
      const useCard = course === "CARD" || course === "IMAGE";
      const showCover = useCard || !launch.startsWith("EXTERNAL") && field("smu_viewer")?.value === "POSTER";
      const href = field("externalurl")?.value ?? "";
      const media = /(?:youtube\.com|youtu\.be|vimeo\.com|\.(?:mp4|webm|mp3|wav|ogg)(?:[?#]|$))/i.test(href);
      ["smu_poster", "thumbnail_url", "poster_filemanager"].forEach((name) => {
        field(name)?.closest(".fitem")?.classList.toggle("d-none", !showCover);
      });
      field("smu_play")?.closest(".fitem")?.classList.toggle("d-none", !useCard || !media);
    }, "refresh");
    form.addEventListener("change", refresh);
    form.addEventListener("input", refresh);
    refresh();
    return () => {
      form.removeEventListener("change", refresh);
      form.removeEventListener("input", refresh);
    };
  }, []);
  const applyPreset = /* @__PURE__ */ __name((name) => {
    const preset = presets[name];
    if (preset) {
      ["course", "launch", "viewer"].forEach((option, index) => {
        const field = trigger.current?.closest("form")?.querySelector('[name="smu_' + option + '"]');
        if (field) {
          field.value = preset[index];
          field.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    }
  }, "applyPreset");
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-2", children: [
      /* @__PURE__ */ jsxDEV("select", { className: "form-select w-auto", value: "", "aria-label": props.preset, onChange: (e) => applyPreset(e.target.value), children: [
        /* @__PURE__ */ jsxDEV("option", { value: "", children: props.preset }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
          lineNumber: 159,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("option", { value: "video", children: props.preset_video }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
          lineNumber: 160,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("option", { value: "document", children: props.preset_document }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
          lineNumber: 161,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV("option", { value: "weblink", children: props.preset_weblink }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
          lineNumber: 162,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
        lineNumber: 158,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV("button", { ref: trigger, className: "btn btn-outline-secondary", type: "button", onClick: () => setOpen(true), children: props.previewresource }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
        lineNumber: 164,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
      lineNumber: 157,
      columnNumber: 9
    }),
    open && createPortal(/* @__PURE__ */ jsxDEV(
      "dialog",
      {
        ref: dialog,
        className: "smu-preview-dialog",
        "aria-labelledby": id + "-title",
        onCancel: (e) => {
          e.preventDefault();
          setOpen(false);
        },
        children: [
          /* @__PURE__ */ jsxDEV("header", { className: "card-header d-flex align-items-center justify-content-between", children: [
            /* @__PURE__ */ jsxDEV("h2", { className: "h5 mb-0", id: id + "-title", children: props.previewresource }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
              lineNumber: 171,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV("button", { className: "btn-close", "aria-label": props.closepreview, type: "button", onClick: () => setOpen(false) }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
              lineNumber: 172,
              columnNumber: 17
            })
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
            lineNumber: 170,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "card-body d-flex flex-wrap align-items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                className: "form-select w-auto",
                "aria-label": props.previewresource,
                value: surface,
                onChange: (e) => setSurface(e.target.value),
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "course", children: props.previewcourse }, void 0, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                    lineNumber: 177,
                    columnNumber: 21
                  }),
                  /* @__PURE__ */ jsxDEV("option", { value: "activity", children: props.previewactivity }, void 0, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                    lineNumber: 178,
                    columnNumber: 21
                  }),
                  /* @__PURE__ */ jsxDEV("option", { value: "auxiliary", children: props.previewauxiliary }, void 0, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                    lineNumber: 179,
                    columnNumber: 21
                  })
                ]
              },
              void 0,
              true,
              {
                fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                lineNumber: 175,
                columnNumber: 17
              }
            ),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                className: "form-select w-auto",
                "aria-label": props.translationlanguage,
                value: language,
                onChange: (e) => setLanguage(e.target.value),
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "", children: props.translationlanguage }, void 0, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                    lineNumber: 183,
                    columnNumber: 21
                  }),
                  props.languages.map((lang) => /* @__PURE__ */ jsxDEV("option", { value: lang.code, children: lang.name }, lang.code, false, {
                    fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                    lineNumber: 184,
                    columnNumber: 50
                  }))
                ]
              },
              void 0,
              true,
              {
                fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                lineNumber: 181,
                columnNumber: 17
              }
            ),
            /* @__PURE__ */ jsxDEV("label", { className: "d-flex align-items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV("input", { type: "checkbox", className: "form-check-input", checked: mobile, onChange: (e) => setMobile(e.target.checked) }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                lineNumber: 187,
                columnNumber: 21
              }),
              props.previewmobile
            ] }, void 0, true, {
              fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
              lineNumber: 186,
              columnNumber: 17
            })
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
            lineNumber: 174,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV(
            "iframe",
            {
              ref: iframe,
              name: "smu-preview" + id,
              title: props.previewresource,
              className: mobile ? "smu-preview-frame smu-preview-mobile" : "smu-preview-frame"
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
              lineNumber: 191,
              columnNumber: 13
            }
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
        lineNumber: 168,
        columnNumber: 31
      }
    ), document.body)
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
    lineNumber: 156,
    columnNumber: 12
  });
}, "AppearancePreview");
var AppearancePreview_default = AppearancePreview;
export {
  AppearancePreview_default as default
};
//# sourceMappingURL=AppearancePreview.dev.js.map
