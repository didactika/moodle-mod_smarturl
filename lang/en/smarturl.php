<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * English language strings for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['pluginname'] = 'Smart URL';
$string['modulename'] = 'Smart URL';
$string['modulename_help'] = 'Link to external websites, videos, or documents with dynamic user/course parameters, structured metadata, flexible display modes, custom completion rules, and centralized governance.';
$string['modulenameplural'] = 'Smart URLs';
$string['pluginadministration'] = 'Smart URL administration';
$string['smarturlname'] = 'Title';
$string['externalurl'] = 'Destination URL';
$string['externalurl_help'] = 'Web address to open. You can insert dynamic placeholders such as {{course_shortname}} or {{user_username}} directly in the URL or append query parameters below.';
$string['invalidurl'] = 'Please enter a valid web address (e.g. https://example.org/...).';

// Capabilities.
$string['smarturl:addinstance'] = 'Add a new Smart URL activity';
$string['smarturl:view'] = 'View Smart URL activity';
$string['smarturl:editgeneral'] = 'Edit title, description, and poster image';
$string['smarturl:editurl'] = 'Edit destination URL and dynamic parameters';
$string['smarturl:editdisplay'] = 'Edit how the resource opens and displays';
$string['smarturl:editcompletion'] = 'Edit completion requirements';
$string['smarturl:editavailability'] = 'Edit course-level access restrictions';
$string['smarturl:overrideavailability'] = 'Override externally managed access restrictions';
$string['smarturl:editmetadata'] = 'Edit metadata fields';
$string['smarturl:reorder'] = 'Reorder Smart URLs inside a section';
$string['smarturl:movesection'] = 'Move Smart URLs to another section';
$string['smarturl:delete'] = 'Delete Smart URL activities';
$string['smarturl:bypasspolicy'] = 'Override protected external fields';
$string['smarturl:manageexternal'] = 'Manage Smart URL instances through external APIs';
$string['smarturl:manageschema'] = 'Configure metadata fields and dynamic URL variables';

// Display & media sections.
$string['appearance'] = 'Display';
$string['displaymode'] = 'Open as';
$string['display_auto'] = 'Automatic (embed videos/PDFs, redirect links)';
$string['display_embed'] = 'Embedded inside activity page';
$string['display_inline_iframe'] = 'Expandable preview inside course & activity';
$string['display_modal'] = 'In-page preview dialog (lightbox)';
$string['display_popup'] = 'Pop-up window from course';
$string['display_new'] = 'New browser tab directly from course';
$string['display_open'] = 'Redirect immediately when clicked';
$string['display_card'] = 'Rich preview card on course page';
$string['popupwidth'] = 'Pop-up width (px)';
$string['popupheight'] = 'Pop-up height (px)';
$string['aspectratio'] = 'Frame aspect ratio';
$string['mediaheader'] = 'Preview card & media details (optional)';
$string['showdescription'] = 'Show description on course page';
$string['thumbnailurl'] = 'Poster image URL';
$string['posterimage'] = 'Upload poster image';
$string['durationseconds'] = 'Duration (seconds)';

// Form builders.
$string['dynamicparams'] = 'URL parameters';
$string['dynamicparams_help'] = 'Append dynamic Moodle values or fixed parameters to the destination URL. Click a variable chip to insert it into the URL or map it to a query parameter below.';
$string['param_queryname'] = 'Parameter name';
$string['param_source'] = 'Value source';
$string['param_staticvalue'] = 'Custom fixed value';
$string['param_choose'] = 'Choose variable...';
$string['param_addmore'] = 'Add parameter';
$string['param_remove'] = 'Remove row';
$string['param_insert_tokens'] = 'Quick tokens for URL:';
$string['param_preview'] = 'Resolved URL preview:';
$string['metadatasection'] = 'Metadata';
$string['metadatasection_help'] = 'Attach searchable metadata fields (category, language, author, duration, tags, etc.) to help learners filter and explore this resource.';
$string['meta_key'] = 'Metadata field';
$string['meta_value'] = 'Value';
$string['meta_customkey'] = 'Custom field name';
$string['meta_addmore'] = 'Add metadata';
$string['policylocknotice'] = 'Some fields are managed externally ({$a->managedby}): {$a->fields}.';
$string['customavailabilitynote'] = 'Externally managed access restrictions remain active alongside any restrictions added here.';

// Admin settings & schema page.
$string['adminconfiglink'] = 'Configure metadata fields & dynamic URL variables';
$string['adminconfigtitle'] = 'Smart URL studio';
$string['adminconfigsubtitle'] = 'Define reusable dynamic URL variables and typed metadata fields for your site.';
$string['defaultdisplaymode'] = 'Default open mode';
$string['defaultpopupwidth'] = 'Default pop-up width (px)';
$string['defaultpopupheight'] = 'Default pop-up height (px)';
$string['lockadmins'] = 'Apply permission locks to site administrators';
$string['lockadmins_desc'] = 'When enabled, site administrators are also checked against the specific checkboxes below when editing protected Smart URLs.';
$string['adminpermissionsheading'] = 'Administrator permissions';
$string['adminpermissions_desc'] = 'Permissions allowed for site administrators when administrator permission locks are enabled.';
$string['metadatatypes'] = 'Metadata fields';
$string['paramdefs'] = 'Dynamic URL variables';
$string['addmetatype'] = 'Save metadata field';
$string['addparamdef'] = 'Save URL variable';
$string['testresolution'] = 'Test URL resolution';
$string['shortname'] = 'Key / shortname';
$string['groupname'] = 'Group';
$string['datatype'] = 'Field type';
$string['priority'] = 'Display priority';
$string['searchable'] = 'Searchable';
$string['filterable'] = 'Filterable';
$string['enabled'] = 'Enabled';
$string['sourcetype'] = 'Source';
$string['sourcekey'] = 'Source key or literal';
$string['defaultqueryparam'] = 'Suggested parameter';

// Resource viewer & course strings.
$string['openresource'] = 'Open in new tab';
$string['launchiframe'] = 'Preview resource';
$string['launchmodal'] = 'Open preview';
$string['launchpopup'] = 'Open pop-up window';
$string['viewdetails'] = 'Details & metadata';
$string['viewmetadata'] = 'Metadata ({$a})';
$string['closepreview'] = 'Close';
$string['metadataheading'] = 'Resource details';
$string['metadatasearch'] = 'Search metadata';
$string['metadatasearchplaceholder'] = 'Filter details by field, value, or tag...';
$string['allgroups'] = 'All';
$string['clearfilters'] = 'Reset filters';
$string['results_count'] = '{$a} attributes';
$string['viewcards'] = 'Cards';
$string['viewtable'] = 'Table';
$string['copyjson'] = 'Copy JSON';
$string['copied'] = 'Copied';
$string['emptymetadata'] = 'No matching attributes';
$string['emptymetadata_hint'] = 'Clear active filters or try a different search term.';
$string['showmore'] = 'Show all ({$a})';
$string['showless'] = 'Show fewer';
$string['managedbadge'] = 'Managed externally';
$string['lockedbadge'] = 'Protected';
$string['completioncustom_group'] = 'Custom completion rules';
$string['nosmarturls'] = 'No Smart URL activities in this course.';
$string['subplugintype_smarturlcomp'] = 'Smart URL completion rule';
$string['subplugintype_smarturlcomp_plural'] = 'Smart URL completion rules';

// Events.
$string['eventresourceoverridden'] = 'Smart URL resource overridden';
$string['eventresourcemoved'] = 'Smart URL resource moved';
$string['eventsectionreordered'] = 'Smart URL section reordered';

// Privacy.
$string['privacy:metadata:policy'] = 'Stores the user who last locally modified a policy-governed Smart URL.';
$string['privacy:metadata:policy:last_modified_by'] = 'The user ID that saved local overrides.';
$string['privacy:metadata:policy:timemodified'] = 'Timestamp of the local override.';
