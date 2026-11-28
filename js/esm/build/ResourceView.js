import{useState as i}from"react";import l from"./components/viewer/PlayerStage";import{formatDuration as c}from"./lib/metadata";import{jsx as n,jsxs as a}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Main Smart URL view mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/ResourceView
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const r=e=>{const[o,s]=i(!1),t=typeof e.durationSeconds=="number"&&e.durationSeconds>0,d=e.displayMode==="EMBED";return a("div",{className:"smu-resource-shell",children:[n(l,{props:e,modalOpen:o,onOpenModal:()=>s(!0),onCloseModal:()=>s(!1)}),(t||e.policy.managedBy||e.policy.lockedFields.length>0||d)&&a("div",{className:"smu-resource-bar",children:[a("div",{className:"dd-tags",children:[t&&n("span",{className:"dd-tag",children:c(e.durationSeconds)}),e.policy.managedBy&&a("span",{className:"dd-tag dd-tag-primary",children:[e.strings.managedbadge??"Managed externally",": ",e.policy.managedBy]}),e.policy.lockedFields.length>0&&a("span",{className:"dd-tag",children:[e.strings.lockedbadge??"Protected",": ",e.policy.lockedFields.join(", ")]})]}),d&&n("a",{href:e.goUrl,target:"_blank",rel:"noopener noreferrer",className:"btn btn-outline-secondary btn-sm",children:e.strings.openresource??"Open in new tab"})]}),e.intro&&a("section",{className:"smu-description",children:[n("h2",{className:"h5",children:e.strings.description}),n("div",{className:"description",dangerouslySetInnerHTML:{__html:e.intro}})]})]})};var y=r;export{y as default};
