import l from"../common/Pix";import{Fragment as u,jsx as a,jsxs as t}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The header of the catalogue, with what the page manages and its actions, and a tab for each section with its count.
 *
 * @module     mod_smarturl/components/admin/CatalogueHeader
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const b=({sections:r,current:s,rows:d,adminUrl:g,settingsUrl:c,icons:i,strings:o,onSection:m,onAdd:p})=>{const y=e=>n=>{!n.ctrlKey&&!n.metaKey&&!n.shiftKey&&!n.altKey&&(n.preventDefault(),m(e))};return t(u,{children:[a("header",{className:"d-grid gap-3 pb-3 border-bottom","data-region":"page-header",children:t("div",{className:"d-flex flex-wrap align-items-center justify-content-between gap-3",children:[t("div",{className:"d-flex align-items-center gap-3",children:[a("span",{className:"icon-box",children:a(l,{html:i.monologo})}),a("p",{className:"text-body-secondary mb-0",children:o.adminconfigsubtitle})]}),t("div",{className:"d-flex flex-wrap align-items-center gap-2","data-region":"actions",children:[t("a",{className:"btn btn-outline-secondary",href:c,children:[a(l,{html:i["i/settings"]})," ",o.settings]}),t("button",{type:"button",className:"btn btn-primary","data-action":"add",onClick:e=>p(e.currentTarget),children:[a(l,{html:i["t/add"]})," ",s.add]})]})]})}),a("ul",{className:"nav nav-tabs","aria-label":o.settings,children:r.map(e=>a("li",{className:"nav-item",children:t("a",{className:"nav-link"+(e.key===s.key?" active":""),href:g+"?tab="+e.key,"data-tab":e.key,"aria-current":e.key===s.key?"page":void 0,onClick:y(e.key),children:[a("span",{children:e.title})," ",a("span",{className:"badge rounded-pill text-bg-secondary",children:d[e.key].length})]})},e.key))})]})};var k=b;export{k as default};
