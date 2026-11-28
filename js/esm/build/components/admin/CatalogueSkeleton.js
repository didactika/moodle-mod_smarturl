import{Columns as p}from"./CatalogueTable";import{jsx as a,jsxs as e}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The columns and the header of a section with rows of placeholders, drawn while its rows are on their way, so a new section
 * never shows the rows of the one before and a filter never shows rows it does not match.
 *
 * @module     mod_smarturl/components/admin/CatalogueSkeleton
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const i=8,u=({section:t,detailed:n,strings:l})=>{const c=[["w-75",n?"w-50":""],...t.columns.map(()=>["w-75"]),["w-50"]];return e("table",{className:"table w-100",children:[a("caption",{className:"visually-hidden",children:t.title}),a(p,{section:t}),a("thead",{children:e("tr",{children:[[l.name,...t.columns,l.status].map(o=>a("th",{scope:"col",children:o},o)),a("th",{scope:"col",className:"text-end","data-column":"actions"})]})}),a("tbody",{children:Array.from({length:i},(o,d)=>e("tr",{"aria-hidden":"true",children:[c.map((r,m)=>a("td",{children:r.filter(Boolean).map(s=>a("span",{className:"placeholder "+s},s))},m)),e("td",{className:"text-end","data-column":"actions",children:[a("span",{className:"placeholder"}),a("span",{className:"placeholder"})]})]},d))})]})};var g=u;export{g as default};
