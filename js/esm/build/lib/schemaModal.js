import{requireAsync as i}from"@moodle/lms/core/amd";import{installSelectMenus as d}from"./selectMenus";/**
 * This file is part of Moodle - https://moodle.org/
 *
 * @module     mod_smarturl/lib/schemaModal
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */const m=(n,s,r)=>{i("core_form/modalform").then(o=>{const e=new o(n);return e.addEventListener(e.events.LOADED,()=>{e.modal.getRoot().find(".modal-dialog").addClass("smu-fixed-modal");const t=d(e.modal.getRoot()[0]);e.modal.getRoot().on("modal:hidden",t)}),e.addEventListener(e.events.FORM_SUBMITTED,t=>s(t.detail)),e.show()}).catch(o=>r(o.message))};export{m as openSchemaModal};
