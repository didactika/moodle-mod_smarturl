import{useState as i}from"react";import r from"./components/viewer/MetadataExplorer";import l from"./components/viewer/PlayerStage";import{formatDuration as c}from"./lib/metadata";import{jsx as a,jsxs as t}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Main Smart URL view mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/ResourceView
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const m=e=>{const[s,n]=i(!1),d=typeof e.durationSeconds=="number"&&e.durationSeconds>0,o=e.displayMode==="EMBED";return t("div",{className:"smu-resource-shell",children:[t("div",{className:"smu-resource-bar",children:[t("div",{className:"dd-tags",children:[d&&a("span",{className:"dd-tag",children:c(e.durationSeconds)}),e.policy.managedBy&&t("span",{className:"dd-tag dd-tag-primary",children:[e.strings.managedbadge??"Managed externally",": ",e.policy.managedBy]}),e.policy.lockedFields.length>0&&t("span",{className:"dd-tag",children:[e.strings.lockedbadge??"Protected",": ",e.policy.lockedFields.join(", ")]})]}),o&&a("a",{href:e.goUrl,target:"_blank",rel:"noopener noreferrer",className:"btn btn-outline-secondary btn-sm",children:e.strings.openresource??"Open in new tab"})]}),a(l,{props:e,modalOpen:s,onOpenModal:()=>n(!0),onCloseModal:()=>n(!1)}),e.intro&&t("section",{className:"card card-body smu-description",children:[a("h2",{className:"h5",children:e.strings.description}),a("div",{className:"description",dangerouslySetInnerHTML:{__html:e.intro}})]}),e.metadata.length>0&&a(r,{entries:e.metadata,strings:e.strings})]})};var b=m;export{b as default};
