import{jsx as e,jsxs as l}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Didactika page header component (dd-page-header).
 *
 * @module     mod_smarturl/components/common/PageHeader
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const n=({breadcrumb:a,title:g,subtitle:s,iconLabel:i="URL",actions:t})=>l("header",{className:"dd-page-header",children:[a&&a.length>0&&e("nav",{"aria-label":"Breadcrumb",children:e("ol",{className:"breadcrumb mb-0",children:a.map((d,r)=>e("li",{className:`breadcrumb-item${r===a.length-1?" active":""}`,"aria-current":r===a.length-1?"page":void 0,children:d.href?e("a",{href:d.href,children:d.label}):d.label},`${d.label}-${r}`))})}),l("div",{className:"dd-page-header-row",children:[l("div",{className:"dd-page-header-main",children:[i&&e("span",{className:"dd-tile dd-tile-lg","aria-hidden":"true",children:i}),l("div",{children:[e("h1",{className:"dd-page-title",children:g}),s&&e("div",{className:"dd-page-subtitle",children:s})]})]}),t&&e("div",{className:"dd-page-actions",children:t})]})]});var c=n;export{c as default};
