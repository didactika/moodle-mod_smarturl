var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Interactive stage supporting embedded iframe, lazy inline preview, modal lightbox, and launch cards.
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
    if (props.displayMode === "NEW" || props.displayMode === "OPEN" || props.displayMode === "CARD" || props.displayMode === "AUTO") {
      window.open(props.resolvedUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (props.displayMode === "MODAL") {
      onOpenModal();
      return;
    }
    setInlineMounted(true);
  }, "launchPrimary");
  const primaryLabel = (() => {
    if (props.displayMode === "INLINE_IFRAME") {
      return props.strings.launchiframe ?? "Load preview here";
    }
    if (props.displayMode === "MODAL") {
      return props.strings.launchmodal ?? "Open preview";
    }
    if (props.displayMode === "POPUP") {
      return props.strings.launchpopup ?? "Open pop-up window";
    }
    return props.strings.openresource ?? "Open in new tab";
  })();
  const hostLabel = (() => {
    try {
      return new URL(props.resolvedUrl).hostname;
    } catch {
      return props.resolvedUrl;
    }
  })();
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
        lineNumber: 82,
        columnNumber: 25
      }
    ) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 81,
      columnNumber: 21
    }) : /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `smu-facade${props.thumbnailUrl ? " has-poster" : ""}`,
        style: props.thumbnailUrl ? { backgroundImage: `linear-gradient(rgb(15 23 42 / 58%), rgb(15 23 42 / 72%)), url(${props.thumbnailUrl})` } : void 0,
        children: /* @__PURE__ */ jsxDEV("div", { className: "smu-facade-inner", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "smu-host-pill", children: hostLabel }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
            lineNumber: 95,
            columnNumber: 29
          }),
          props.intro && /* @__PURE__ */ jsxDEV(
            "div",
            {
              className: "smu-facade-intro",
              dangerouslySetInnerHTML: { __html: props.intro }
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
              lineNumber: 97,
              columnNumber: 33
            }
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "smu-facade-actions", children: /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-primary", onClick: launchPrimary, children: primaryLabel }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
            lineNumber: 104,
            columnNumber: 33
          }) }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
            lineNumber: 103,
            columnNumber: 29
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 94,
          columnNumber: 25
        })
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 90,
        columnNumber: 21
      }
    ) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 79,
      columnNumber: 13
    }),
    modalOpen && /* @__PURE__ */ jsxDEV("div", { className: "smu-modal-backdrop", role: "dialog", "aria-modal": "true", "aria-label": props.name, children: /* @__PURE__ */ jsxDEV("div", { className: "smu-modal", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "smu-modal-bar", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "fw-semibold", children: props.name }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 117,
          columnNumber: 29
        }),
        /* @__PURE__ */ jsxDEV("div", { className: "d-flex align-items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(
            "a",
            {
              href: props.goUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "btn btn-outline-secondary btn-sm",
              onClick: notifyView,
              children: props.strings.openresource ?? "Open in new tab"
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
              lineNumber: 119,
              columnNumber: 33
            }
          ),
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-outline-secondary btn-sm", onClick: onCloseModal, children: props.strings.closepreview ?? "Close" }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
            lineNumber: 128,
            columnNumber: 33
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 118,
          columnNumber: 29
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 116,
        columnNumber: 25
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "smu-frame-wrap", children: /* @__PURE__ */ jsxDEV("iframe", { src: props.resolvedUrl, title: props.name, allowFullScreen: true }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 134,
        columnNumber: 29
      }) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 133,
        columnNumber: 25
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 115,
      columnNumber: 21
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 114,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
    lineNumber: 78,
    columnNumber: 9
  });
}, "PlayerStage");
var PlayerStage_default = PlayerStage;
export {
  PlayerStage_default as default
};
//# sourceMappingURL=PlayerStage.dev.js.map
