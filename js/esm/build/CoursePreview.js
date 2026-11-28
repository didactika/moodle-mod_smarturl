import{useState as i}from"react";import{trackView as l}from"./services/api";import{jsx as r,jsxs as m}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const u=({cmid:s,label:a,player:o})=>{const[e,t]=i(!1);return m("details",{className:"smu-course-inline",onToggle:n=>{n.currentTarget.open&&!e&&(t(!0),l(s,!1).catch(()=>{}))},children:[r("summary",{className:"btn btn-outline-secondary",children:a}),e&&r("div",{className:"smu-course-iframe-wrap",dangerouslySetInnerHTML:{__html:o}})]})};var f=u;export{f as default};
