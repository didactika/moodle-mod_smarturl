import{useState as r}from"react";import s from"./components/common/PageHeader";import c from"./components/viewer/MetadataExplorer";import m from"./components/viewer/PlayerStage";import{formatDuration as g}from"./lib/metadata";import{trackView as u}from"./services/api";import{Fragment as y,jsx as a,jsxs as t}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Main Smart URL view mounted via core/react_autoinit on Moodle 5.3+.
 *
 * @module     mod_smarturl/ResourceView
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const b=e=>{const[l,n]=r(!1),o=()=>{if(u(e.cmid).catch(()=>null),e.displayMode==="MODAL"){n(!0);return}if(e.displayMode==="POPUP"){window.open(e.resolvedUrl,`smarturl_${e.cmid}`,`width=${e.popupWidth},height=${e.popupHeight},scrollbars=yes,resizable=yes`);return}window.open(e.resolvedUrl,"_blank","noopener,noreferrer")},i=t(y,{children:[a("span",{className:"badge text-bg-light",children:e.displayMode}),e.durationSeconds&&a("span",{className:"badge text-bg-light",children:g(e.durationSeconds)}),e.policy.managedBy&&t("span",{className:"badge badge-soft rounded-pill text-bg-info",children:[e.strings.managedbadge??"Externally governed",": ",e.policy.managedBy]}),e.policy.lockedFields.length>0&&t("span",{className:"badge badge-soft rounded-pill text-bg-secondary",children:[e.strings.lockedbadge??"Policy locked",": ",e.policy.lockedFields.join(", ")]})]}),d=a("button",{type:"button",className:"btn btn-primary",onClick:o,children:e.strings.openresource??"Open resource"});return t("div",{children:[a(s,{breadcrumb:[{label:e.coursename,href:e.courseurl},{label:e.name}],title:e.name,subtitle:i,iconLabel:"URL",actions:d}),a(m,{props:e,modalOpen:l,onOpenModal:()=>n(!0),onCloseModal:()=>n(!1)}),e.metadata.length>0&&a(c,{entries:e.metadata,strings:e.strings})]})};var k=b;export{k as default};
