import{useState as b}from"react";import f from"../common/MoodleModal";import{trackView as g}from"../../services/api";import{jsx as a,jsxs as s}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Interactive stage supporting embedded iframe, lazy inline preview, modal lightbox, and launch cards.
 *
 * @module     mod_smarturl/components/viewer/PlayerStage
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const M=({props:e,modalOpen:m,onCloseModal:c,onOpenModal:d})=>{const[u,y]=b(e.displayMode==="EMBED"),t=e.displayMode==="MODAL",r=e.playerHtml&&(t||e.displayMode==="INLINE_IFRAME"),o=a("i",{className:e.playable?"fa fa-play":"fa fa-external-link","aria-hidden":"true"}),i="btn btn-primary smu-launch-circle"+(e.thumbnailUrl?" smu-play-overlay":""),l=e.playable?e.strings.playresource:r?t?e.strings.launchmodal:e.strings.launchiframe:e.strings.openresource,n=a("div",{className:"smu-player",style:{"--smu-player-ratio":e.aspectRatio.replace(":"," / ")},dangerouslySetInnerHTML:{__html:e.playerHtml}});return s("section",{className:"smu-stage",children:[u&&e.playerHtml?n:s("div",{className:e.thumbnailUrl?"smu-cover-stage":"smu-empty-stage",children:[e.thumbnailUrl&&a("img",{src:e.thumbnailUrl,alt:"",className:"smu-viewer-cover"}),r?a("button",{type:"button",className:i,"aria-label":l,title:l,onClick:()=>{g(e.cmid).catch(()=>{}),t?d():y(!0)},children:o}):a("a",{href:e.goUrl,target:"_blank",rel:"noopener noreferrer",className:i,title:l,"aria-label":l,children:o})]}),m&&a(f,{title:e.name,large:!0,onClose:c,children:a("div",{className:"mod-smarturl",children:n})})]})};var P=M;export{P as default};
