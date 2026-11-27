import{useState as o}from"react";import l from"./components/viewer/MetadataExplorer";import r from"./components/viewer/PlayerStage";import{formatDuration as c}from"./lib/metadata";import{jsx as a,jsxs as n}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Main Smart URL view mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/ResourceView
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const m=e=>{const[i,t]=o(!1),s=typeof e.durationSeconds=="number"&&e.durationSeconds>0,d=e.displayMode==="EMBED";return n("div",{className:"smu-resource-shell",children:[(s||e.policy.managedBy||e.policy.lockedFields.length>0||d)&&n("div",{className:"smu-resource-bar",children:[n("div",{className:"dd-tags",children:[s&&a("span",{className:"dd-tag",children:c(e.durationSeconds)}),e.policy.managedBy&&n("span",{className:"dd-tag dd-tag-primary",children:[e.strings.managedbadge??"Managed externally",": ",e.policy.managedBy]}),e.policy.lockedFields.length>0&&n("span",{className:"dd-tag",children:[e.strings.lockedbadge??"Protected",": ",e.policy.lockedFields.join(", ")]})]}),d&&a("a",{href:e.goUrl,target:"_blank",rel:"noopener noreferrer",className:"btn btn-outline-secondary btn-sm",children:e.strings.openresource??"Open in new tab"})]}),a(r,{props:e,modalOpen:i,onOpenModal:()=>t(!0),onCloseModal:()=>t(!1)}),e.intro&&n("section",{className:"smu-description",children:[a("h2",{className:"h5",children:e.strings.description}),a("div",{className:"description",dangerouslySetInnerHTML:{__html:e.intro}})]}),e.metadata.length>0&&a(l,{entries:e.metadata,strings:e.strings})]})};var b=m;export{b as default};
