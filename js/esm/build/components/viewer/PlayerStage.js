import{useEffect as b,useRef as m,useState as v}from"react";import{trackView as N}from"../../services/api";import{jsx as a,jsxs as l}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Interactive stage supporting embedded iframe, lazy inline preview, modal lightbox, and launch cards.
 *
 * @module     mod_smarturl/components/viewer/PlayerStage
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const M=({props:e,modalOpen:r,onCloseModal:s,onOpenModal:u})=>{const[f,g]=v(e.displayMode==="EMBED"),n=m(null),c=m(null),o=e.displayMode==="MODAL",y=e.playerHtml&&(o||e.displayMode==="INLINE_IFRAME");b(()=>{if(!r||!n.current)return;const t=n.current;return t.showModal(),()=>{t.close(),c.current?.focus()}},[r]);const i=a("div",{className:"smu-player",style:{"--smu-player-ratio":e.aspectRatio.replace(":"," / ")},dangerouslySetInnerHTML:{__html:e.playerHtml}}),d=a("a",{href:e.goUrl,target:"_blank",rel:"noopener noreferrer",className:"btn btn-outline-secondary",children:e.strings.openresource});return l("section",{className:"smu-stage",children:[f&&e.playerHtml?i:l("div",{className:"card",children:[e.thumbnailUrl&&a("img",{src:e.thumbnailUrl,alt:"",className:"smu-viewer-cover"}),a("div",{className:"card-body d-flex flex-wrap gap-2",children:y?a("button",{ref:c,type:"button",className:"btn btn-primary",onClick:()=>{N(e.cmid).catch(()=>{}),o?u():g(!0)},children:o?e.strings.launchmodal:e.strings.launchiframe}):d})]}),r&&a("dialog",{ref:n,className:"smu-player-dialog","aria-label":e.name,onCancel:t=>{t.preventDefault(),s()},children:l("div",{className:"card",children:[l("header",{className:"card-header d-flex align-items-center justify-content-between gap-2",children:[a("strong",{children:e.name}),a("button",{type:"button",className:"btn-close","aria-label":e.strings.closepreview,onClick:s})]}),a("div",{className:"card-body",children:i}),a("footer",{className:"card-footer",children:d})]})})]})};var P=M;export{P as default};
