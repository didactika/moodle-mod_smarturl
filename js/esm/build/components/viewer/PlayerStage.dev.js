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
import { useState } from "react";
import MoodleModal from "../common/MoodleModal";
import { trackView } from "../../services/api";
const PlayerStage = /* @__PURE__ */ __name(({ props, modalOpen, onCloseModal, onOpenModal }) => {
  const [mounted, setMounted] = useState(props.displayMode === "EMBED");
  const modal = props.displayMode === "MODAL";
  const canPreview = props.playerHtml && (modal || props.displayMode === "INLINE_IFRAME");
  const icon = /* @__PURE__ */ jsxDEV("i", { className: props.playable ? "fa fa-play" : "fa fa-external-link", "aria-hidden": "true" }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
    lineNumber: 28,
    columnNumber: 18
  });
  const circle = "btn btn-primary smu-launch-circle" + (props.thumbnailUrl ? " smu-play-overlay" : "");
  const label = props.playable ? props.strings.playresource : canPreview ? modal ? props.strings.launchmodal : props.strings.launchiframe : props.strings.openresource;
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
      lineNumber: 32,
      columnNumber: 20
    }
  );
  return /* @__PURE__ */ jsxDEV("section", { className: "smu-stage", children: [
    mounted && props.playerHtml ? player : /* @__PURE__ */ jsxDEV("div", { className: props.thumbnailUrl ? "smu-cover-stage" : "smu-empty-stage", children: [
      props.thumbnailUrl && /* @__PURE__ */ jsxDEV("img", { src: props.thumbnailUrl, alt: "", className: "smu-viewer-cover" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 38,
        columnNumber: 36
      }),
      canPreview ? /* @__PURE__ */ jsxDEV("button", { type: "button", className: circle, "aria-label": label, title: label, onClick: () => {
        void trackView(props.cmid).catch(() => void 0);
        if (modal) {
          onOpenModal();
        } else {
          setMounted(true);
        }
      }, children: icon }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
        lineNumber: 39,
        columnNumber: 27
      }) : /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: props.goUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: circle,
          title: label,
          "aria-label": label,
          children: icon
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
          lineNumber: 46,
          columnNumber: 34
        }
      )
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 37,
      columnNumber: 49
    }),
    modalOpen && /* @__PURE__ */ jsxDEV(MoodleModal, { title: props.name, large: true, onClose: onCloseModal, children: /* @__PURE__ */ jsxDEV("div", { className: "mod-smarturl", children: player }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 50,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
      lineNumber: 49,
      columnNumber: 23
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/components/viewer/PlayerStage.tsx",
    lineNumber: 36,
    columnNumber: 12
  });
}, "PlayerStage");
var PlayerStage_default = PlayerStage;
export {
  PlayerStage_default as default
};
//# sourceMappingURL=PlayerStage.dev.js.map
