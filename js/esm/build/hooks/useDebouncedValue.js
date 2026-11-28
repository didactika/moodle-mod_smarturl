import{useEffect as r,useState as c}from"react";/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @module     mod_smarturl/hooks/useDebouncedValue
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const d=(e,t)=>{const[o,n]=c(e);return r(()=>{const u=window.setTimeout(()=>n(e),t);return()=>window.clearTimeout(u)},[e,t]),o};export{d as useDebouncedValue};
