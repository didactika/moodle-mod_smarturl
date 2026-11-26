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
$string['modulename_help'] = 'Share externally hosted resources with dynamic URL parameterization, structured typed metadata, customizable display modes, extensible completion rules, and policy governance.';
$string['modulenameplural'] = 'Smart URLs';
$string['pluginadministration'] = 'Smart URL administration';
$string['smarturlname'] = 'Name';
$string['externalurl'] = 'External URL';
$string['externalurl_help'] = 'Destination URL. Supports {{shortname}} placeholders for enabled dynamic URL parameters (for example {{course_id}} or {{user_username}}).';
$string['invalidurl'] = 'Entered URL is not valid.';

// Capabilities.
$string['smarturl:addinstance'] = 'Add a new Smart URL activity';
$string['smarturl:view'] = 'View Smart URL activity';
$string['smarturl:editgeneral'] = 'Edit general details (name, description, poster)';
$string['smarturl:editurl'] = 'Edit external URL and URL parameters';
$string['smarturl:editdisplay'] = 'Edit appearance and display mode';
$string['smarturl:editcompletion'] = 'Edit activity completion settings';
$string['smarturl:editavailability'] = 'Edit course-local access restrictions';
$string['smarturl:overrideavailability'] = 'Override externally managed access restrictions';
$string['smarturl:editmetadata'] = 'Edit structured metadata entries';
$string['smarturl:reorder'] = 'Reorder Smart URLs within a section';
$string['smarturl:movesection'] = 'Move Smart URLs across sections';
$string['smarturl:delete'] = 'Delete Smart URL activities';
$string['smarturl:bypasspolicy'] = 'Bypass external field-lock policies';
$string['smarturl:manageexternal'] = 'Manage Smart URL instances via external web services';
$string['smarturl:manageschema'] = 'Configure metadata types and dynamic URL parameters';

// Display modes.
$string['appearance'] = 'Appearance';
$string['displaymode'] = 'Display mode';
$string['display_auto'] = 'Automatic';
$string['display_embed'] = 'Embed on resource page';
$string['display_inline_iframe'] = 'Inline click-to-play iframe';
$string['display_modal'] = 'Modal lightbox';
$string['display_popup'] = 'In pop-up window';
$string['display_new'] = 'New browser tab';
$string['display_open'] = 'Open directly';
$string['display_card'] = 'Card with poster & metadata';
$string['popupwidth'] = 'Pop-up width (in pixels)';
$string['popupheight'] = 'Pop-up height (in pixels)';
$string['aspectratio'] = 'Frame aspect ratio';
$string['showdescription'] = 'Display description on course page';
$string['thumbnailurl'] = 'Poster / thumbnail URL';
$string['durationseconds'] = 'Duration (seconds)';

// Form sections.
$string['dynamicparams'] = 'Dynamic URL parameters';
$string['dynamicparams_help'] = 'Bind query parameter names to configured dynamic tokens (such as course ID, user ID, custom fields) or fixed literals. You can also place {{shortname}} tokens directly inside the External URL.';
$string['param_queryname'] = 'Query parameter name';
$string['param_source'] = 'Dynamic variable or static value';
$string['param_staticvalue'] = 'Static value';
$string['param_choose'] = 'Choose variable...';
$string['param_addmore'] = 'Add parameter rows';
$string['metadatasection'] = 'Structured metadata';
$string['metadatasection_help'] = 'Attach typed metadata fields defined in site settings or ad-hoc key/value attributes.';
$string['meta_key'] = 'Metadata field / key';
$string['meta_value'] = 'Value';
$string['meta_customkey'] = 'Custom key';
$string['meta_addmore'] = 'Add metadata rows';
$string['policylocknotice'] = 'Some settings in this activity are governed by an external policy ({$a->managedby}): {$a->fields}.';
$string['customavailabilitynote'] = 'This activity also enforces externally managed access restrictions that are preserved automatically when you save.';

// Admin settings & schema page.
$string['adminconfiglink'] = 'Manage metadata types & dynamic URL parameters';
$string['adminconfigtitle'] = 'Smart URL configuration';
$string['adminconfigsubtitle'] = 'Define reusable dynamic URL parameters and typed metadata schemas across the site.';
$string['defaultdisplaymode'] = 'Default display mode';
$string['defaultpopupwidth'] = 'Default pop-up width';
$string['defaultpopupheight'] = 'Default pop-up height';
$string['lockadmins'] = 'Apply permission restrictions to site administrators';
$string['lockadmins_desc'] = 'When enabled, site administrators must also hold each enabled checkbox below to bypass granular capability checks on externally governed Smart URLs.';
$string['adminpermissionsheading'] = 'Administrator permissions';
$string['adminpermissions_desc'] = 'Granular capabilities granted to site administrators when administrator restrictions are active.';
$string['metadatatypes'] = 'Metadata types';
$string['paramdefs'] = 'Dynamic URL parameters';
$string['addmetatype'] = 'Add metadata type';
$string['addparamdef'] = 'Add dynamic parameter';
$string['testresolution'] = 'Test URL resolution';
$string['shortname'] = 'Shortname / key';
$string['groupname'] = 'Group';
$string['datatype'] = 'Data type';
$string['priority'] = 'Display priority';
$string['searchable'] = 'Searchable';
$string['filterable'] = 'Filterable';
$string['enabled'] = 'Enabled';
$string['sourcetype'] = 'Source type';
$string['sourcekey'] = 'Source key / literal';
$string['defaultqueryparam'] = 'Suggested query param';

// Resource viewer & metadata explorer strings.
$string['openresource'] = 'Open resource';
$string['launchiframe'] = 'Load interactive preview';
$string['closepreview'] = 'Close';
$string['metadataheading'] = 'Resource metadata';
$string['metadatasearch'] = 'Search metadata';
$string['metadatasearchplaceholder'] = 'Search attributes, values, tags...';
$string['allgroups'] = 'All';
$string['clearfilters'] = 'Clear all';
$string['results_count'] = '{$a} attributes';
$string['viewcards'] = 'Grouped cards';
$string['viewtable'] = 'Compact table';
$string['copyjson'] = 'Copy JSON';
$string['copied'] = 'Copied';
$string['emptymetadata'] = 'No metadata matches your search';
$string['emptymetadata_hint'] = 'Try clearing active group filters or changing your search query.';
$string['showmore'] = 'Show all ({$a})';
$string['showless'] = 'Show fewer';
$string['managedbadge'] = 'Externally governed';
$string['lockedbadge'] = 'Policy locked';
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
