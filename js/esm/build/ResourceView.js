import{useState as i}from"react";import l from"./components/viewer/MetadataExplorer";import c from"./components/viewer/PlayerStage";import{formatDuration as m}from"./lib/metadata";import{jsx as a,jsxs as t}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Main Smart URL view mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/ResourceView
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const g={AUTO:"Automatic",EMBED:"Embedded on page",INLINE_IFRAME:"Interactive preview",MODAL:"Preview dialog",POPUP:"Pop-up window",NEW:"New browser tab",OPEN:"Direct redirect",CARD:"Preview card"},u=e=>{const[n,d]=i(!1),s=typeof e.durationSeconds=="number"&&e.durationSeconds>0,o=e.displayMode==="EMBED",r=g[e.displayMode]??e.displayMode;return t("div",{className:"smu-resource-shell",children:[t("div",{className:"smu-resource-bar",children:[t("div",{className:"dd-tags",children:[a("span",{className:"dd-tag",children:r}),s&&a("span",{className:"dd-tag",children:m(e.durationSeconds)}),e.policy.managedBy&&t("span",{className:"dd-tag dd-tag-primary",children:[e.strings.managedbadge??"Managed externally",": ",e.policy.managedBy]}),e.policy.lockedFields.length>0&&t("span",{className:"dd-tag",children:[e.strings.lockedbadge??"Protected",": ",e.policy.lockedFields.join(", ")]})]}),o&&a("a",{href:e.goUrl,target:"_blank",rel:"noopener noreferrer",className:"btn btn-outline-secondary btn-sm",children:e.strings.openresource??"Open in new tab"})]}),a(c,{props:e,modalOpen:n,onOpenModal:()=>d(!0),onCloseModal:()=>d(!1)}),e.metadata.length>0&&a(l,{entries:e.metadata,strings:e.strings})]})};var E=u;export{E as default};
