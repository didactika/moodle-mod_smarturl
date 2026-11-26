var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
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
import { useEffect, useRef, useState } from "react";
import { trackView } from "../../services/api";
const PlayerStage = /* @__PURE__ */ __name(({ props, modalOpen, onCloseModal, onOpenModal }) => {
  const [mounted, setMounted] = useState(props.displayMode === "EMBED");
  const dialog = useRef(null);
  const trigger = useRef(null);
  const modal = props.displayMode === "MODAL";
  const canPreview = props.playerHtml && (modal || props.displayMode === "INLINE_IFRAME");
  useEffect(() => {
    if (!modalOpen || !dialog.current) {
      return void 0;
    }
    const node = dialog.current;
    node.showModal();
    return () => {
      node.close();
      trigger.current?.focus();
    };
  }, [modalOpen]);
  const player = /* @__PURE__ */ jsxDEV(
    "div",
    {
      className: "smu-player",
      style: { "--smu-player-ratio": props.aspectRatio.replace(":", " / ") },
      dangerouslySetInnerHTML: { __html: props.playerHtml }
    },
    void 0,
    false,
    {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 42,
      columnNumber: 20
    }
  );
  const external = /* @__PURE__ */ jsxDEV("a", { href: props.goUrl, target: "_blank", rel: "noopener noreferrer", className: "btn btn-outline-secondary", children: props.strings.openresource }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
    lineNumber: 46,
    columnNumber: 22
  });
  return /* @__PURE__ */ jsxDEV("section", { className: "smu-stage", children: [
    mounted && props.playerHtml ? player : /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
      props.thumbnailUrl && /* @__PURE__ */ jsxDEV("img", { src: props.thumbnailUrl, alt: "", className: "smu-viewer-cover" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 53,
        columnNumber: 40
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "card-body d-flex flex-wrap gap-2", children: canPreview ? /* @__PURE__ */ jsxDEV(
        "button",
        {
          ref: trigger,
          type: "button",
          className: "btn btn-primary",
          onClick: () => {
            void trackView(props.cmid).catch(() => void 0);
            if (modal) {
              onOpenModal();
            } else {
              setMounted(true);
            }
          },
          children: modal ? props.strings.launchmodal : props.strings.launchiframe
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 56,
          columnNumber: 25
        }
      ) : external }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 54,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 52,
      columnNumber: 13
    }),
    modalOpen && /* @__PURE__ */ jsxDEV(
      "dialog",
      {
        ref: dialog,
        className: "smu-player-dialog",
        "aria-label": props.name,
        onCancel: (event) => {
          event.preventDefault();
          onCloseModal();
        },
        children: /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
          /* @__PURE__ */ jsxDEV("header", { className: "card-header d-flex align-items-center justify-content-between gap-2", children: [
            /* @__PURE__ */ jsxDEV("strong", { children: props.name }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
              lineNumber: 80,
              columnNumber: 25
            }),
            /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn-close", "aria-label": props.strings.closepreview, onClick: onCloseModal }, void 0, false, {
              fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
              lineNumber: 81,
              columnNumber: 25
            })
          ] }, void 0, true, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
            lineNumber: 79,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("div", { className: "card-body", children: player }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
            lineNumber: 83,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV("footer", { className: "card-footer", children: external }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
            lineNumber: 84,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 78,
          columnNumber: 17
        })
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 73,
        columnNumber: 13
      }
    )
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
    lineNumber: 50,
    columnNumber: 12
  });
}, "PlayerStage");
var PlayerStage_default = PlayerStage;
export {
  PlayerStage_default as default
};
//# sourceMappingURL=PlayerStage.dev.js.map
