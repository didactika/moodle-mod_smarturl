import s from"../common/Pix";import{jsx as t,jsxs as l}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The empty state of a catalogue section. After a search or a filter it says nothing matched and offers to clear them; the first
 * time it says what the section holds and offers to create the first item.
 *
 * @module     mod_smarturl/components/admin/CatalogueEmpty
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const c=({section:o,filtered:e,icons:a,strings:n,onAdd:r,onClear:m})=>l("div",{className:"d-flex flex-column align-items-center gap-2 px-4 py-5 text-center",children:[t("span",{className:"icon-box"+(e?" text-info":""),children:t(s,{html:a[e?"a/search":o.icon]})}),t("p",{className:"h6 fw-bold mb-0",children:e?n.emptyresults:o.emptytitle}),t("p",{className:"text-body-secondary mb-0",children:e?n.emptyresultstext:o.emptytext}),e?t("button",{type:"button",className:"btn btn-outline-secondary mt-2",onClick:m,children:n.clearfilters}):l("button",{type:"button",className:"btn btn-primary mt-2",onClick:p=>r(p.currentTarget),children:[t(s,{html:a["t/add"]})," ",o.add]})]});var b=c;export{b as default};
