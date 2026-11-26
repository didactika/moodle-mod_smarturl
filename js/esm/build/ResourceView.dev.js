var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
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
import PageHeader from "./components/common/PageHeader";
import MetadataExplorer from "./components/viewer/MetadataExplorer";
import PlayerStage from "./components/viewer/PlayerStage";
import { formatDuration } from "./lib/metadata";
import { trackView } from "./services/api";
const ResourceView = /* @__PURE__ */ __name((props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = /* @__PURE__ */ __name(() => {
    trackView(props.cmid).catch(() => null);
    if (props.displayMode === "MODAL") {
      setModalOpen(true);
      return;
    }
    if (props.displayMode === "POPUP") {
      window.open(
        props.resolvedUrl,
        `smarturl_${props.cmid}`,
        `width=${props.popupWidth},height=${props.popupHeight},scrollbars=yes,resizable=yes`
      );
      return;
    }
    window.open(props.resolvedUrl, "_blank", "noopener,noreferrer");
  }, "handleOpen");
  const subtitle = /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-light", children: props.displayMode }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
      lineNumber: 42,
      columnNumber: 13
    }),
    props.durationSeconds && /* @__PURE__ */ jsxDEV("span", { className: "badge text-bg-light", children: formatDuration(props.durationSeconds) }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
      lineNumber: 43,
      columnNumber: 39
    }),
    props.policy.managedBy && /* @__PURE__ */ jsxDEV("span", { className: "badge badge-soft rounded-pill text-bg-info", children: [
      props.strings.managedbadge ?? "Externally governed",
      ": ",
      props.policy.managedBy
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
      lineNumber: 45,
      columnNumber: 17
    }),
    props.policy.lockedFields.length > 0 && /* @__PURE__ */ jsxDEV("span", { className: "badge badge-soft rounded-pill text-bg-secondary", children: [
      props.strings.lockedbadge ?? "Policy locked",
      ": ",
      props.policy.lockedFields.join(", ")
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
      lineNumber: 50,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
    lineNumber: 41,
    columnNumber: 9
  });
  const actions = /* @__PURE__ */ jsxDEV("button", { type: "button", className: "btn btn-primary", onClick: handleOpen, children: props.strings.openresource ?? "Open resource" }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
    lineNumber: 58,
    columnNumber: 9
  });
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV(
      PageHeader,
      {
        breadcrumb: [{ label: props.coursename, href: props.courseurl }, { label: props.name }],
        title: props.name,
        subtitle,
        iconLabel: "URL",
        actions
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
        lineNumber: 65,
        columnNumber: 13
      }
    ),
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
        lineNumber: 73,
        columnNumber: 13
      }
    ),
    props.metadata.length > 0 && /* @__PURE__ */ jsxDEV(MetadataExplorer, { entries: props.metadata, strings: props.strings }, void 0, false, {
      fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
      lineNumber: 81,
      columnNumber: 17
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/ResourceView.tsx",
    lineNumber: 64,
    columnNumber: 9
  });
}, "ResourceView");
var ResourceView_default = ResourceView;
export {
  ResourceView_default as default
};
//# sourceMappingURL=ResourceView.dev.js.map
