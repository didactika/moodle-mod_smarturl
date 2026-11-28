var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { jsxDEV } from "react/jsx-dev-runtime";
/**
 * This file is part of Moodle - https://moodle.org/
 *
 * The catalogue of the site, drawn as the working list of the Didactika design system: the header with what the page manages
 * and its actions, a tab for each section with its count, and a card with the toolbar (the search, the status chips with their
 * counts and the button that clears them), the table of the section, its empty state and the pager. The section, the search,
 * the status and the page are kept in the address; items are added, edited and deleted in the modal forms of Moodle.
 *
 * @module     mod_smarturl/AdminConfig
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import CatalogueEmpty from "./components/admin/CatalogueEmpty";
import CatalogueFilters from "./components/admin/CatalogueFilters";
import CatalogueHeader from "./components/admin/CatalogueHeader";
import CataloguePager from "./components/admin/CataloguePager";
import CatalogueSkeleton from "./components/admin/CatalogueSkeleton";
import CatalogueTable from "./components/admin/CatalogueTable";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { hasStatus, pageOf, PAGE_SIZES, searched } from "./lib/catalogue";
import { openSchemaModal } from "./lib/schemaModal";
import { installSelectMenus } from "./lib/selectMenus";
const SEARCH_DELAY = 300;
const fromAddress = /* @__PURE__ */ __name(() => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  return {
    query: (params.get("q") ?? "").trim(),
    status: status === "active" || status === "inactive" ? status : "",
    page: Math.max(0, Number(params.get("page") ?? 1) - 1) || 0
  };
}, "fromAddress");
const AdminConfig = /* @__PURE__ */ __name((props) => {
  const { strings: t, icons } = props;
  const initial = useMemo(fromAddress, []);
  const [sectionKey, setSectionKey] = useState(props.tab);
  const [rows, setRows] = useState(props.rows);
  const [typed, setTyped] = useState(initial.query);
  const [status, setStatus] = useState(initial.status);
  const [page, setPage] = useState(initial.page);
  const [perPage, setPerPage] = useState(PAGE_SIZES[0]);
  const [failure, setFailure] = useState(null);
  const [pending, startTransition] = useTransition();
  const root = useRef(null);
  const debounced = useDebouncedValue(typed.trim(), SEARCH_DELAY);
  const query = typed.trim() ? debounced : "";
  const section = props.sections.find((item) => item.key === sectionKey) ?? props.sections[0];
  const found = useMemo(() => searched(rows[section.key], query), [rows, section.key, query]);
  const matching = useMemo(() => found.filter((row) => hasStatus(row, status)), [found, status]);
  const count = matching.length;
  const view = pageOf(count, perPage, page);
  const narrowed = Boolean(query || status);
  const range = t.pagerange.replace("{$a->from}", String(count ? view.offset + 1 : 0)).replace("{$a->to}", String(Math.min(view.offset + view.span, count))).replace("{$a->total}", String(count));
  useEffect(() => root.current ? installSelectMenus(root.current) : void 0, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", section.key);
    const kept = [["q", query], ["status", status], ["page", view.current ? String(view.current + 1) : ""]];
    kept.forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState(null, "", url);
  }, [section.key, query, status, view.current]);
  const update = /* @__PURE__ */ __name((change) => startTransition(change), "update");
  const clearFilters = /* @__PURE__ */ __name(() => update(() => {
    setTyped("");
    setStatus("");
    setPage(0);
  }), "clearFilters");
  const open = /* @__PURE__ */ __name((opener, row, remove = false) => {
    setFailure(null);
    const title = document.createElement("span");
    title.textContent = section.add;
    if (row) {
      title.textContent = remove ? t.deletecategoryheading.replace("{$a}", row.name) : t.edit;
    }
    openSchemaModal({
      formClass: "mod_smarturl\\form\\schema_item",
      args: { section: section.key, id: row?.id ?? 0, remove: Number(remove) },
      modalConfig: { title: title.innerHTML, large: false, scrollable: true },
      saveButtonText: remove ? t.delete : t.savechanges,
      saveButtonClasses: remove ? "btn-danger" : void 0,
      returnFocus: opener
    }, setRows, (message) => setFailure({ message, retry: /* @__PURE__ */ __name(() => open(opener, row, remove), "retry") }));
  }, "open");
  return /* @__PURE__ */ jsxDEV("div", { className: "mod-smarturl", "data-region": "catalogue", ref: root, children: /* @__PURE__ */ jsxDEV("div", { className: "d-grid gap-3", children: [
    /* @__PURE__ */ jsxDEV(
      CatalogueHeader,
      {
        sections: props.sections,
        current: section,
        rows,
        adminUrl: props.adminUrl,
        settingsUrl: props.settingsUrl,
        icons,
        strings: t,
        onAdd: open,
        onSection: (key) => update(() => {
          setSectionKey(key);
          setTyped("");
          setStatus("");
          setPage(0);
        })
      },
      void 0,
      false,
      {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 129,
        columnNumber: 13
      }
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "d-grid gap-3 mt-2", "data-region": "list", children: [
      /* @__PURE__ */ jsxDEV(
        CatalogueFilters,
        {
          search: typed,
          status,
          narrowed,
          icons,
          strings: t,
          counts: {
            "": found.length,
            active: found.filter((row) => hasStatus(row, "active")).length,
            inactive: found.filter((row) => hasStatus(row, "inactive")).length
          },
          onSearch: (text) => {
            setTyped(text);
            update(() => setPage(0));
          },
          onStatus: (value) => update(() => {
            setStatus(value);
            setPage(0);
          }),
          onClear: clearFilters
        },
        void 0,
        false,
        {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 138,
          columnNumber: 17
        }
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "card", children: [
        failure && /* @__PURE__ */ jsxDEV("div", { className: "alert alert-danger", role: "alert", "data-region": "error", children: /* @__PURE__ */ jsxDEV("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { children: failure.message }, void 0, false, {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 156,
            columnNumber: 29
          }),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              className: "btn btn-outline-danger btn-sm",
              "data-action": "retry",
              onClick: () => failure.retry(),
              children: t.retry
            },
            void 0,
            false,
            {
              fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
              lineNumber: 157,
              columnNumber: 29
            }
          )
        ] }, void 0, true, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 155,
          columnNumber: 25
        }) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 154,
          columnNumber: 33
        }),
        (count > 0 || pending) && /* @__PURE__ */ jsxDEV("div", { className: "table-responsive", "data-region": "tablewrap", "aria-busy": pending, children: pending ? /* @__PURE__ */ jsxDEV(
          CatalogueSkeleton,
          {
            section,
            strings: t,
            detailed: rows[section.key].some((row) => row.detail)
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 163,
            columnNumber: 31
          }
        ) : /* @__PURE__ */ jsxDEV(
          CatalogueTable,
          {
            section,
            rows: matching.slice(view.offset, view.offset + view.span),
            icons,
            strings: t,
            onOpen: open
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 165,
            columnNumber: 31
          }
        ) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 161,
          columnNumber: 48
        }),
        !count && !pending && /* @__PURE__ */ jsxDEV("div", { "data-region": "empty", children: /* @__PURE__ */ jsxDEV(
          CatalogueEmpty,
          {
            section,
            filtered: narrowed,
            icons,
            strings: t,
            onAdd: (opener) => open(opener),
            onClear: clearFilters
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 169,
            columnNumber: 25
          }
        ) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 168,
          columnNumber: 44
        }),
        count > 0 && !pending && /* @__PURE__ */ jsxDEV("div", { className: "px-3 py-2", "data-region": "foot", children: /* @__PURE__ */ jsxDEV(
          CataloguePager,
          {
            sizes: view.sizes,
            size: view.size,
            range,
            first: view.first,
            last: view.last,
            icons,
            strings: t,
            onSize: (size) => update(() => {
              setPerPage(size);
              setPage(0);
            }),
            onPage: (step) => update(() => setPage(view.current + step))
          },
          void 0,
          false,
          {
            fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
            lineNumber: 174,
            columnNumber: 25
          }
        ) }, void 0, false, {
          fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
          lineNumber: 173,
          columnNumber: 47
        })
      ] }, void 0, true, {
        fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
        lineNumber: 153,
        columnNumber: 17
      })
    ] }, void 0, true, {
      fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
      lineNumber: 137,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
    lineNumber: 128,
    columnNumber: 9
  }) }, void 0, false, {
    fileName: "public/mod/smarturl/js/esm/src/AdminConfig.tsx",
    lineNumber: 127,
    columnNumber: 12
  });
}, "AdminConfig");
var AdminConfig_default = AdminConfig;
export {
  AdminConfig_default as default
};
//# sourceMappingURL=AdminConfig.dev.js.map
