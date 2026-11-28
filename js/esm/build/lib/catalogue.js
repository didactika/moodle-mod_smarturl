/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * What the site catalogue shows: the rows a search and a status leave, the counts of the status chips, the page sizes and the
 * page on show. Pure functions, so the screen only draws what they return.
 *
 * @module     mod_smarturl/lib/catalogue
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const c=[12,24,48,96],l=500,u=(e,t)=>{const o=t.trim().toLocaleLowerCase();return e.filter(n=>[n.name,n.detail,...n.columns].some(s=>String(s).toLocaleLowerCase().includes(o)))},p=(e,t)=>!t||e.enabled===(t==="active"),g=e=>{const t=c.filter(o=>o<e);return e<=l&&t.push(0),t},m=(e,t,o)=>{const n=g(e),s=n.includes(t)?t:n[n.length-1],a=s||Math.max(1,e),i=Math.min(o,Math.max(0,Math.ceil(e/a)-1)),r=i*a;return{sizes:n,size:s,span:a,current:i,offset:r,first:r===0,last:r+a>=e}};export{c as PAGE_SIZES,p as hasStatus,m as pageOf,g as pageSizes,u as searched};
