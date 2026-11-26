var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Pure helpers for high-volume metadata filtering, grouping, and formatting.
 *
 * @module     mod_smarturl/lib/metadata
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
const formatDuration = /* @__PURE__ */ __name((raw) => {
  const secs = Number(raw);
  if (!Number.isFinite(secs) || secs <= 0) {
    return String(raw ?? "");
  }
  const hrs = Math.floor(secs / 3600);
  const mins = Math.floor(secs % 3600 / 60);
  const rem = Math.floor(secs % 60);
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  }
  return `${mins}:${String(rem).padStart(2, "0")}`;
}, "formatDuration");
const filterByQuery = /* @__PURE__ */ __name((entries, query) => {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return entries;
  }
  return entries.filter((entry) => {
    if (!entry.searchable) {
      return false;
    }
    return entry.label.toLowerCase().includes(needle) || entry.key.toLowerCase().includes(needle) || entry.value.toLowerCase().includes(needle) || entry.group.toLowerCase().includes(needle);
  });
}, "filterByQuery");
const computeGroupFacets = /* @__PURE__ */ __name((entries) => {
  const counts = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    counts.set(entry.group, (counts.get(entry.group) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}, "computeGroupFacets");
const groupEntries = /* @__PURE__ */ __name((entries) => {
  const map = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const list = map.get(entry.group) ?? [];
    list.push(entry);
    map.set(entry.group, list);
  }
  return Array.from(map.entries());
}, "groupEntries");
const splitTags = /* @__PURE__ */ __name((value) => value.split(",").map((part) => part.trim()).filter((part) => part.length > 0), "splitTags");
export {
  computeGroupFacets,
  filterByQuery,
  formatDuration,
  groupEntries,
  splitTags
};
//# sourceMappingURL=metadata.dev.js.map
