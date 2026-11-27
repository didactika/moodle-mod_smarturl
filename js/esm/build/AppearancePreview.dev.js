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
import MoodleModal from "./components/common/MoodleModal";
import { installSelectMenus } from "./lib/selectMenus";
const AppearancePreview = /* @__PURE__ */ __name((props) => {
  const trigger = useRef(null);
  const iframe = useRef(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [surface, setSurface] = useState("course");
  const [language, setLanguage] = useState("");
  const [mobile, setMobile] = useState(false);
  const resize = /* @__PURE__ */ __name(() => {
    const frame = iframe.current;
    const content = frame?.contentDocument?.querySelector(".smu-draft-preview");
    if (frame && content) {
      frame.style.height = Math.min(content.scrollHeight + 4, window.innerHeight * 0.6) + "px";
    }
  }, "resize");
  useEffect(() => {
    window.requestAnimationFrame(resize);
  }, [mobile]);
  const [previewPane, setPreviewPane] = useState(null);
  useEffect(() => previewPane ? installSelectMenus(previewPane) : void 0, [previewPane]);
  useEffect(() => {
    const editor = trigger.current?.closest("form");
    if (!open || !editor || !previewPane || !iframe.current) {
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
  }, [open, previewPane, surface, language, props.url, props.courseid, props.cmid, props.sesskey]);
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
      const viewer = field("smu_viewer")?.value || "AUTO";
      const href = field("externalurl")?.value ?? "";
      const media = /(?:youtube\.com|youtu\.be|vimeo\.com|\.(?:mp4|webm|mp3|wav|ogg)(?:[?#]|$))/i.test(href);
      const showCover = useCard || !launch.startsWith("EXTERNAL") && (viewer !== "AUTO" || !media) && viewer !== "EMBED";
      const popup = ["VIEWERWINDOW", "EXTERNALWINDOW"].includes(launch);
      ["popup_width", "popup_height"].forEach((name) => field(name)?.closest(".fitem")?.classList.toggle("d-none", !popup));
      form.querySelector("[data-smu-cover-heading]")?.classList.toggle("d-none", !showCover);
      ["smu_poster", "thumbnail_url", "poster_filemanager"].forEach((name) => {
        field(name)?.closest(".fitem")?.classList.toggle("d-none", !showCover);
      });
      field("smu_play")?.closest(".fitem")?.classList.toggle("d-none", !useCard || !media);
    }, "refresh");
    form.addEventListener("change", refresh);
    form.addEventListener("input", refresh);
    refresh();
    const cleanMenus = installSelectMenus(form);
    return () => {
      cleanMenus();
      form.removeEventListener("change", refresh);
      form.removeEventListener("input", refresh);
    };
  }, []);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center gap-2", children: /* @__PURE__ */ jsxDEV("button", { ref: trigger, className: "btn btn-outline-secondary", type: "button", onClick: () => setOpen(true), children: [
      /* @__PURE__ */ jsxDEV("i", { className: "fa fa-eye me-2", "aria-hidden": "true" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
        lineNumber: 122,
        columnNumber: 17
      }),
      props.previewresource
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
      lineNumber: 121,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
      lineNumber: 120,
      columnNumber: 9
    }),
    open && /* @__PURE__ */ jsxDEV(MoodleModal, { title: props.previewresource, large: true, onClose: () => setOpen(false), children: /* @__PURE__ */ jsxDEV("div", { ref: setPreviewPane, className: "mod-smarturl", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "smu-preview-toolbar d-flex flex-wrap align-items-center gap-2 pb-3 border-bottom", children: [
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
                lineNumber: 130,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("option", { value: "activity", children: props.previewactivity }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                lineNumber: 131,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("option", { value: "auxiliary", children: props.previewauxiliary }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                lineNumber: 132,
                columnNumber: 21
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
            lineNumber: 128,
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
              /* @__PURE__ */ jsxDEV("option", { value: "", children: props.previewcurrentlanguage }, void 0, false, {
                fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                lineNumber: 136,
                columnNumber: 21
              }),
              props.languages.map((lang) => /* @__PURE__ */ jsxDEV("option", { value: lang.code, children: lang.name }, lang.code, false, {
                fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
                lineNumber: 137,
                columnNumber: 50
              }))
            ]
          },
          void 0,
          true,
          {
            fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
            lineNumber: 134,
            columnNumber: 17
          }
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "form-check", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: id + "-mobile",
              type: "checkbox",
              className: "form-check-input",
              checked: mobile,
              onChange: (e) => setMobile(e.target.checked)
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
              lineNumber: 140,
              columnNumber: 21
            }
          ),
          /* @__PURE__ */ jsxDEV("label", { className: "form-check-label", htmlFor: id + "-mobile", children: props.previewmobile }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
            lineNumber: 142,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
          lineNumber: 139,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
        lineNumber: 127,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        "iframe",
        {
          ref: iframe,
          onLoad: resize,
          name: "smu-preview" + id,
          title: props.previewresource,
          className: mobile ? "smu-preview-frame smu-preview-mobile" : "smu-preview-frame"
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
          lineNumber: 145,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
      lineNumber: 126,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
      lineNumber: 125,
      columnNumber: 18
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/AppearancePreview.tsx",
    lineNumber: 119,
    columnNumber: 12
  });
}, "AppearancePreview");
var AppearancePreview_default = AppearancePreview;
export {
  AppearancePreview_default as default
};
//# sourceMappingURL=AppearancePreview.dev.js.map
