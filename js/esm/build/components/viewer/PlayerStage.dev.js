var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Interactive stage supporting click-to-play lazy inline iframe, modal lightbox, and popup/tab launch.
 *
 * @module     mod_smarturl/components/viewer/PlayerStage
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useState } from "react";
import { trackView } from "../../services/api";
const PlayerStage = /* @__PURE__ */ __name(({ props, modalOpen, onCloseModal, onOpenModal }) => {
  const [inlineMounted, setInlineMounted] = useState(props.displayMode === "EMBED");
  const [tracked, setTracked] = useState(false);
  const notifyView = /* @__PURE__ */ __name(() => {
    if (tracked) {
      return;
    }
    setTracked(true);
    trackView(props.cmid).catch(() => null);
  }, "notifyView");
  const launchPrimary = /* @__PURE__ */ __name(() => {
    notifyView();
    if (props.displayMode === "POPUP") {
      window.open(
        props.resolvedUrl,
        `smarturl_${props.cmid}`,
        `width=${props.popupWidth},height=${props.popupHeight},scrollbars=yes,resizable=yes`
      );
      return;
    }
    if (props.displayMode === "NEW") {
      window.open(props.resolvedUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (props.displayMode === "MODAL") {
      onOpenModal();
      return;
    }
    setInlineMounted(true);
  }, "launchPrimary");
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "smu-stage", children: inlineMounted ? /* @__PURE__ */ jsxDEV("div", { className: "smu-frame-wrap", style: { aspectRatio: props.aspectRatio.replace(":", " / ") }, children: /* @__PURE__ */ jsxDEV(
      "iframe",
      {
        src: props.resolvedUrl,
        title: props.name,
        allowFullScreen: true,
        loading: "lazy"
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 61,
        columnNumber: 25
      }
    ) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 60,
      columnNumber: 21
    }) : /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "smu-facade",
        style: props.thumbnailUrl ? { backgroundImage: `linear-gradient(rgb(15 23 42 / 55%), rgb(15 23 42 / 65%)), url(${props.thumbnailUrl})`, color: "#fff" } : void 0,
        children: /* @__PURE__ */ jsxDEV("div", { className: "d-grid gap-3 justify-items-center", children: [
          props.intro && /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "small",
              style: { maxWidth: "42rem" },
              dangerouslySetInnerHTML: { __html: props.intro }
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
              lineNumber: 75,
              columnNumber: 33
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap gap-2 justify-content-center", children: [
            /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-primary", onClick: launchPrimary, children: props.displayMode === "INLINE_IFRAME" ? props.strings.launchiframe ?? "Load interactive preview" : props.strings.openresource ?? "Open resource" }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
              lineNumber: 83,
              columnNumber: 33
            }),
            /* @__PURE__ */ jsxDEV(
              "a",
              {
                href: props.goUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "btn btn-outline-secondary",
                onClick: notifyView,
                children: props.strings.openresource ?? "Open resource"
              },
              void 0,
              false,
              {
                fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
                lineNumber: 88,
                columnNumber: 33
              }
            )
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
            lineNumber: 82,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 73,
          columnNumber: 25
        })
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 69,
        columnNumber: 21
      }
    ) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 58,
      columnNumber: 13
    }),
    modalOpen && /* @__PURE__ */ jsxDEV("div", { className: "smu-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": props.name, children: /* @__PURE__ */ jsxDEV("div", { className: "smu-modal", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "smu-modal-bar", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "fw-semibold", children: props.name }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 107,
          columnNumber: 29
        }),
        /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary btn-sm", onClick: onCloseModal, children: props.strings.closepreview ?? "Close" }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 108,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 106,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-frame-wrap", children: /* @__PURE__ */ jsxDEV("iframe", { src: props.resolvedUrl, title: props.name, allowFullScreen: true }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 113,
        columnNumber: 29
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 112,
        columnNumber: 25
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 105,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 104,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
    lineNumber: 57,
    columnNumber: 9
  });
}, "PlayerStage");
var PlayerStage_default = PlayerStage;
export {
  PlayerStage_default as default
};
//# sourceMappingURL=PlayerStage.dev.js.map
