var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Main Smart URL view mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/ResourceView
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useState } from "react";
import MetadataExplorer from "./components/viewer/MetadataExplorer";
import PlayerStage from "./components/viewer/PlayerStage";
import { formatDuration } from "./lib/metadata";
const ResourceView = /* @__PURE__ */ __name((props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const hasDuration = typeof props.durationSeconds === "number" && props.durationSeconds > 0;
  const isEmbedStage = props.displayMode === "EMBED";
  return /* @__PURE__ */ jsxDEV("div", { className: "smu-resource-shell", children: [
    (hasDuration || props.policy.managedBy || props.policy.lockedFields.length > 0 || isEmbedStage) && /* @__PURE__ */ jsxDEV("div", { className: "smu-resource-bar", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "dd-tags", children: [
        hasDuration && /* @__PURE__ */ jsxDEV("span", { className: "dd-tag", children: formatDuration(props.durationSeconds) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
          lineNumber: 28,
          columnNumber: 25
        }),
        props.policy.managedBy && /* @__PURE__ */ jsxDEV("span", { className: "dd-tag dd-tag-primary", children: [
          props.strings.managedbadge ?? "Managed externally",
          ": ",
          props.policy.managedBy
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
          lineNumber: 31,
          columnNumber: 25
        }),
        props.policy.lockedFields.length > 0 && /* @__PURE__ */ jsxDEV("span", { className: "dd-tag", children: [
          props.strings.lockedbadge ?? "Protected",
          ": ",
          props.policy.lockedFields.join(", ")
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
          lineNumber: 36,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
        lineNumber: 26,
        columnNumber: 17
      }),
      isEmbedStage && /* @__PURE__ */ jsxDEV(
        "a",
        {
          href: props.goUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "btn btn-outline-secondary btn-sm",
          children: props.strings.openresource ?? "Open in new tab"
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
          lineNumber: 42,
          columnNumber: 21
        }
      )
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
      lineNumber: 25,
      columnNumber: 113
    }),
    /* @__PURE__ */ jsxDEV(
      PlayerStage,
      {
        props,
        modalOpen,
        onOpenModal: () => setModalOpen(true),
        onCloseModal: () => setModalOpen(false)
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
        lineNumber: 53,
        columnNumber: 13
      }
    ),
    props.intro && /* @__PURE__ */ jsxDEV("section", { className: "smu-description", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "h5", children: props.strings.description }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
        lineNumber: 62,
        columnNumber: 21
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "description", dangerouslySetInnerHTML: { __html: props.intro } }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
        lineNumber: 63,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
      lineNumber: 61,
      columnNumber: 17
    }),
    props.metadata.length > 0 && /* @__PURE__ */ jsxDEV(MetadataExplorer, { entries: props.metadata, strings: props.strings }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
      lineNumber: 68,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
    lineNumber: 24,
    columnNumber: 9
  });
}, "ResourceView");
var ResourceView_default = ResourceView;
export {
  ResourceView_default as default
};
//# sourceMappingURL=ResourceView.dev.js.map
