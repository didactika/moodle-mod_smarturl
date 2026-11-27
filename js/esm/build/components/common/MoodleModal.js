import{useEffect as f,useRef as h,useState as y}from"react";import{createPortal as m}from"react-dom";import{requireAsync as C}from"@moodle/lms/core/amd";import{Fragment as p,jsxs as H}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/components/common/MoodleModal
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function L({title:s,large:i,children:u,footer:o,onClose:l}){const[e,v]=y(),d=h(l);return d.current=l,f(()=>{let a=!0,n;const M=document.activeElement instanceof HTMLElement?document.activeElement:void 0,c=document.createElement("span");return c.textContent=s,C("core/modal").then(t=>t.create({title:c.innerHTML,large:i,removeOnClose:!1,returnElement:M})).then(t=>{if(!a){t.destroy();return}n=t;const r=t.getRoot();r.find(".modal-dialog").addClass("smu-fixed-modal"),r.on("modal:hidden",()=>d.current());const g=t.getBody()[0],E=r.find(".modal-footer")[0]??document.createElement("div");v({body:g,footer:E}),t.show()}).catch(()=>d.current()),()=>{a=!1,n&&(n.getRoot().off("modal:hidden"),n.hide(),n.destroy())}},[s,i]),f(()=>{e&&(e.footer.hidden=!o,e.footer.classList.toggle("d-none",!o))},[e,o]),e?H(p,{children:[m(u,e.body),o&&m(o,e.footer)]}):null}export{L as default};
