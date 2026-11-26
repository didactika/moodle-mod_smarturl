var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Typed value renderer for Didactika metadata entries.
 *
 * @module     mod_smarturl/components/viewer/MetadataValue
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useState } from "react";
import { formatDuration, splitTags } from "../../lib/metadata";
const MetadataValue = /* @__PURE__ */ __name(({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  switch (entry.datatype) {
    case "BADGE":
      return /* @__PURE__ */ jsxDEV("span", { className: "badge badge-soft rounded-pill text-bg-primary", children: entry.value }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
        lineNumber: 25,
        columnNumber: 20
      });
    case "TAGS": {
      const tags = splitTags(entry.value);
      return /* @__PURE__ */ jsxDEV("div", { className: "dd-tags", children: tags.map((tag, idx) => /* @__PURE__ */ jsxDEV("span", { className: "dd-tag", children: tag }, `${tag}-${idx}`, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
        lineNumber: 32,
        columnNumber: 25
      })) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
        lineNumber: 30,
        columnNumber: 17
      });
    }
    case "URL":
      return /* @__PURE__ */ jsxDEV("a", { href: entry.value, target: "_blank", rel: "noopener noreferrer", children: entry.value }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
        lineNumber: 40,
        columnNumber: 17
      });
    case "DURATION":
      return /* @__PURE__ */ jsxDEV("span", { children: formatDuration(entry.value) }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
        lineNumber: 46,
        columnNumber: 20
      });
    case "BOOLEAN": {
      const truthy = ["1", "true", "yes", "si"].includes(entry.value.trim().toLowerCase());
      return /* @__PURE__ */ jsxDEV("span", { className: `badge badge-soft rounded-pill ${truthy ? "text-bg-success" : "text-bg-secondary"}`, children: truthy ? "Yes" : "No" }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
        lineNumber: 51,
        columnNumber: 17
      });
    }
    case "MULTILINE": {
      const isLong = entry.value.length > 180;
      const shown = !isLong || expanded ? entry.value : `${entry.value.slice(0, 180)}...`;
      return /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("div", { className: "mb-1", children: shown }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
          lineNumber: 62,
          columnNumber: 21
        }),
        isLong && /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: "btn btn-link btn-sm p-0",
            onClick: () => setExpanded((prev) => !prev),
            children: expanded ? "Show less" : "Show more"
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
            lineNumber: 64,
            columnNumber: 25
          }
        )
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
        lineNumber: 61,
        columnNumber: 17
      });
    }
    default:
      return /* @__PURE__ */ jsxDEV("span", { children: entry.value }, void 0, false, {
        fileName: "public/mod/smarturl/js/esm/src/components/viewer/MetadataValue.tsx",
        lineNumber: 77,
        columnNumber: 20
      });
  }
}, "MetadataValue");
var MetadataValue_default = MetadataValue;
export {
  MetadataValue_default as default
};
//# sourceMappingURL=MetadataValue.dev.js.map
