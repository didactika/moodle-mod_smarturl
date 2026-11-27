import{useEffect as f,useRef as h,useState as y}from"react";import{createPortal as m}from"react-dom";import{requireAsync as L}from"@moodle/lms/core/amd";import{Fragment as H,jsxs as T}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/components/common/MoodleModal
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */function p({title:d,large:i,children:u,footer:o,onClose:l}){const[e,M]=y(),r=h(l);return r.current=l,f(()=>{let s=!0,n;const v=document.activeElement instanceof HTMLElement?document.activeElement:void 0,c=document.createElement("span");return c.textContent=d,L("core/modal").then(t=>t.create({title:c.innerHTML,large:i,removeOnClose:!1,returnElement:v})).then(t=>{if(!s){t.destroy();return}n=t;const a=t.getRoot();a.on("modal:hidden",()=>r.current());const E=t.getBody()[0],g=a.find(".modal-footer")[0]??document.createElement("div");M({body:E,footer:g}),t.show()}).catch(()=>r.current()),()=>{s=!1,n&&(n.getRoot().off("modal:hidden"),n.hide(),n.destroy())}},[d,i]),f(()=>{e&&(e.footer.hidden=!o,e.footer.classList.toggle("d-none",!o))},[e,o]),e?T(H,{children:[m(u,e.body),o&&m(o,e.footer)]}):null}export{p as default};
