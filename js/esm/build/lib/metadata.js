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
 */const a=n=>{const t=Number(n);if(!Number.isFinite(t)||t<=0)return String(n??"");const r=Math.floor(t/3600),e=Math.floor(t%3600/60),o=Math.floor(t%60);return r>0?`${r}:${String(e).padStart(2,"0")}:${String(o).padStart(2,"0")}`:`${e}:${String(o).padStart(2,"0")}`},s=(n,t)=>{const r=t.trim().toLowerCase();return r?n.filter(e=>e.searchable?e.label.toLowerCase().includes(r)||e.key.toLowerCase().includes(r)||e.value.toLowerCase().includes(r)||e.group.toLowerCase().includes(r):!1):n},i=n=>{const t=new Map;for(const r of n)t.set(r.group,(t.get(r.group)??0)+1);return Array.from(t.entries()).map(([r,e])=>({name:r,count:e}))},u=n=>{const t=new Map;for(const r of n){const e=t.get(r.group)??[];e.push(r),t.set(r.group,e)}return Array.from(t.entries())},p=n=>n.split(",").map(t=>t.trim()).filter(t=>t.length>0);export{i as computeGroupFacets,s as filterByQuery,a as formatDuration,u as groupEntries,p as splitTags};
