import{useState as r}from"react";import{formatDuration as d,splitTags as u}from"../../lib/metadata";import{jsx as e,jsxs as c}from"react/jsx-runtime";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Typed value renderer for Didactika metadata entries.
 *
 * @module     mod_smarturl/components/viewer/MetadataValue
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const p=({entry:a})=>{const[o,l]=r(!1);switch(a.datatype){case"BADGE":return e("span",{className:"badge badge-soft rounded-pill text-bg-primary",children:a.value});case"TAGS":{const s=u(a.value);return e("div",{className:"dd-tags",children:s.map((t,n)=>e("span",{className:"dd-tag",children:t},`${t}-${n}`))})}case"URL":return e("a",{href:a.value,target:"_blank",rel:"noopener noreferrer",children:a.value});case"DURATION":return e("span",{children:d(a.value)});case"BOOLEAN":{const s=["1","true","yes","si"].includes(a.value.trim().toLowerCase());return e("span",{className:`badge badge-soft rounded-pill ${s?"text-bg-success":"text-bg-secondary"}`,children:s?"Yes":"No"})}case"MULTILINE":{const s=a.value.length>180,t=!s||o?a.value:`${a.value.slice(0,180)}...`;return c("div",{children:[e("div",{className:"mb-1",children:t}),s&&e("button",{type:"button",className:"btn btn-link btn-sm p-0",onClick:()=>l(n=>!n),children:o?"Show less":"Show more"})]})}default:return e("span",{children:a.value})}};var v=p;export{v as default};
