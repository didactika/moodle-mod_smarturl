var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * What the site catalogue shows: the rows a search and a status leave, the counts of the status chips, the page sizes and the
 * page on show. Pure functions, so the screen only draws what they return.
 *
 * @module     mod_smarturl/lib/catalogue
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
const PAGE_SIZES = [12, 24, 48, 96];
const ALL_LIMIT = 500;
const searched = /* @__PURE__ */ __name((rows, query) => {
  const needle = query.trim().toLocaleLowerCase();
  return rows.filter((row) => [row.name, row.detail, ...row.columns].some((value) => String(value).toLocaleLowerCase().includes(needle)));
}, "searched");
const hasStatus = /* @__PURE__ */ __name((row, status) => !status || row.enabled === (status === "active"), "hasStatus");
const pageSizes = /* @__PURE__ */ __name((count) => {
  const sizes = PAGE_SIZES.filter((size) => size < count);
  if (count <= ALL_LIMIT) {
    sizes.push(0);
  }
  return sizes;
}, "pageSizes");
const pageOf = /* @__PURE__ */ __name((count, wanted, page) => {
  const sizes = pageSizes(count);
  const size = sizes.includes(wanted) ? wanted : sizes[sizes.length - 1];
  const span = size || Math.max(1, count);
  const current = Math.min(page, Math.max(0, Math.ceil(count / span) - 1));
  const offset = current * span;
  return { sizes, size, span, current, offset, first: offset === 0, last: offset + span >= count };
}, "pageOf");
export {
  PAGE_SIZES,
  hasStatus,
  pageOf,
  pageSizes,
  searched
};
//# sourceMappingURL=catalogue.dev.js.map
