import{useId as g}from"react";import o from"../common/Pix";import{jsx as e,jsxs as n}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The pager of the catalogue: the page size, the rows on show and the previous and next pages.
 *
 * @module     mod_smarturl/components/admin/CataloguePager
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const u=({sizes:r,size:d,range:m,first:b,last:c,icons:s,strings:t,onSize:p,onPage:l})=>{const i=g();return n("div",{className:"d-flex flex-wrap align-items-center justify-content-between gap-3 small text-body-secondary",children:[n("div",{className:"d-none d-sm-flex align-items-center gap-2",children:[e("label",{htmlFor:i,className:"mb-0",children:t.pagerlabel}),e("select",{className:"form-select form-select-sm",id:i,"data-region":"perpage",value:d,onChange:a=>p(Number(a.target.value)),children:r.map(a=>e("option",{value:a,children:a||t.all},a))})]}),n("div",{className:"d-flex flex-wrap align-items-center gap-3 ms-auto",children:[e("span",{className:"text-body text-nowrap",role:"status","data-region":"range",children:m}),n("div",{className:"d-flex gap-1",children:[e("button",{type:"button",className:"btn btn-outline-secondary btn-sm btn-icon","data-action":"prev",disabled:b,title:t.previous,"aria-label":t.previous,onClick:()=>l(-1),children:e(o,{html:s["i/previous"]})}),e("button",{type:"button",className:"btn btn-outline-secondary btn-sm btn-icon","data-action":"next",disabled:c,title:t.next,"aria-label":t.next,onClick:()=>l(1),children:e(o,{html:s["i/next"]})})]})]})]})};var x=u;export{x as default};
