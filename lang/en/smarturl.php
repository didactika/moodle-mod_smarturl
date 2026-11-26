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
$string['modulename_help'] = 'Add a link to a website, video, audio file or document. Choose how it opens and add details about the resource.';
$string['modulenameplural'] = 'Smart URLs';
$string['pluginadministration'] = 'Smart URL administration';
$string['smarturlname'] = 'Title';
$string['externalurl'] = 'Link';
$string['externalurl_help'] = 'Enter the resource address. You can insert variables in the link or add URL parameters below.';
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
$string['appearance'] = 'Appearance';
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
$string['mediaheader'] = 'Cover image';
$string['showdescription'] = 'Show description on course page';
$string['thumbnailurl'] = 'Image URL';
$string['posterimage'] = 'Upload image';
$string['durationseconds'] = 'Duration (seconds)';

// Form builders.
$string['dynamicparams'] = 'URL variables';
$string['dynamicparams_help'] = 'Insert a variable in the link or pass a value as a URL parameter.';
$string['param_queryname'] = 'Parameter name';
$string['param_source'] = 'Value source';
$string['param_staticvalue'] = 'Fixed value';
$string['param_choose'] = 'Choose a variable';
$string['param_addmore'] = 'Add parameter';
$string['param_remove'] = 'Remove row';
$string['param_insert_tokens'] = 'Insert variable';
$string['param_preview'] = 'Link preview';
$string['metadatasection'] = 'Resource details';
$string['metadatasection_help'] = 'Add details such as author, language or format. Choose where they appear under Appearance.';
$string['meta_key'] = 'Metadata field';
$string['meta_value'] = 'Value';
$string['meta_customkey'] = 'Custom field';
$string['meta_addmore'] = 'Add field';
$string['policylocknotice'] = 'Managed fields ({$a->managedby}) · {$a->fields}';
$string['customavailabilitynote'] = 'Externally managed access restrictions remain active alongside any restrictions added here.';

// Admin settings & schema page.
$string['adminconfiglink'] = 'Smart URL configuration';
$string['adminconfigtitle'] = 'Smart URL configuration';
$string['adminconfigsubtitle'] = 'Manage categories, resource fields and URL variables for this site.';
$string['defaultdisplaymode'] = 'Default open mode';
$string['defaultpopupwidth'] = 'Default pop-up width (px)';
$string['defaultpopupheight'] = 'Default pop-up height (px)';
$string['metadatatypes'] = 'Resource fields';
$string['paramdefs'] = 'URL variables';
$string['addmetatype'] = 'Save field';
$string['addparamdef'] = 'Save variable';
$string['testresolution'] = 'Test link';
$string['shortname'] = 'Key';
$string['groupname'] = 'Category';
$string['datatype'] = 'Field type';
$string['priority'] = 'Display priority';
$string['searchable'] = 'Searchable';
$string['filterable'] = 'Filterable';
$string['enabled'] = 'Enabled';
$string['sourcetype'] = 'Source';
$string['sourcekey'] = 'Source key or literal';
$string['defaultqueryparam'] = 'Suggested parameter';

// Resource viewer & course strings.
$string['openresource'] = 'Open in another tab';
$string['launchiframe'] = 'Preview resource';
$string['launchmodal'] = 'Open preview';
$string['launchpopup'] = 'Open pop-up window';
$string['viewdetails'] = 'View details';
$string['viewmetadata'] = 'Metadata ({$a})';
$string['closepreview'] = 'Close';
$string['metadataheading'] = 'Resource details';
$string['metadatasearch'] = 'Search metadata';
$string['metadatasearchplaceholder'] = 'Filter details by field, value, or tag...';
$string['allgroups'] = 'All';
$string['clearfilters'] = 'Clear filters';
$string['results_count'] = '{$a} attributes';
$string['viewcards'] = 'Cards';
$string['viewtable'] = 'Table';
$string['copyjson'] = 'Copy JSON';
$string['copied'] = 'Copied';
$string['emptymetadata'] = 'No results';
$string['emptymetadata_hint'] = 'Change the search or clear the filters.';
$string['showmore'] = 'Show all ({$a})';
$string['showless'] = 'Show fewer';
$string['managedbadge'] = 'Managed externally';
$string['lockedbadge'] = 'Protected';
$string['completioncustom_group'] = 'Custom completion rules';
$string['nosmarturls'] = 'There are no Smart URLs in this course.';
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

$string['defaultcoursestyle_desc'] = 'Initially selected for new activities.';
$string['usemimeicons'] = 'Use file type icons';
$string['usemimeicons_desc'] = 'Show Moodle icons for recognised file extensions, such as PDF or audio.';
$string['presentation_course'] = 'On the course page';
$string['presentation_launch'] = 'When the resource is selected';
$string['presentation_viewer'] = 'In the Smart URL viewer';
$string['presentation_poster'] = 'Cover image source';
$string['presentation_title'] = 'Show the title';
$string['presentation_icon'] = 'Show the activity icon';
$string['presentation_description'] = 'Show the description';
$string['presentation_play'] = 'Show a play button over the image';
$string['course_link'] = 'Link';
$string['course_card'] = 'Card';
$string['course_image'] = 'Image only';
$string['launch_auto'] = 'Automatic';
$string['launch_activity'] = 'Open the activity';
$string['launch_viewertab'] = 'Open viewer in another tab';
$string['launch_viewerwindow'] = 'Open viewer in a window';
$string['launch_external'] = 'Go to the external site';
$string['launch_externaltab'] = 'Open the external site in another tab';
$string['launch_externalwindow'] = 'Open the external site in a window';
$string['launch_inline'] = 'Preview in the course';
$string['viewer_auto'] = 'Automatic';
$string['viewer_embed'] = 'Embed the resource';
$string['viewer_poster'] = 'Cover with a preview button';
$string['viewer_link'] = 'Details and external link';
$string['viewer_modal'] = 'Preview in a dialog';
$string['poster_auto'] = 'Automatic';
$string['poster_upload'] = 'Uploaded image';
$string['poster_url'] = 'Image URL';
$string['poster_provider'] = 'Provider image';
$string['poster_none'] = 'No image';
$string['coursefieldsmode'] = 'Details on the course page';
$string['viewerfieldsmode'] = 'Details in the viewer';
$string['fieldmode_default'] = 'Use defaults';
$string['fieldmode_none'] = 'Hide details';
$string['fieldmode_select'] = 'Choose fields';
$string['fieldselection'] = 'Fields in display order';
$string['fieldselection_help'] = 'Enter the field keys separated by commas, in the order to show them.';
$string['preset'] = 'Apply a preset';
$string['preset_video'] = 'Video';
$string['preset_document'] = 'Document';
$string['preset_weblink'] = 'Web link';
$string['translate'] = 'Translations';
$string['translationlanguage'] = 'Language to edit';
$string['translationtitle'] = 'Translated title';
$string['translationdescription'] = 'Translated description';
$string['translationhint'] = 'Leave a field empty to use the original text.';
$string['previewresource'] = 'Preview appearance';
$string['previewcourse'] = 'On the course page';
$string['previewactivity'] = 'In the activity';
$string['previewauxiliary'] = 'Auxiliary viewer';
$string['previewmobile'] = 'Mobile width';
$string['previewpending'] = 'Preparing preview…';
$string['openexternal'] = 'Open on the external site';
$string['playresource'] = 'Play resource';
$string['category'] = 'Category';
$string['categories'] = 'Categories';
$string['category_name'] = 'Category name';
$string['createcategory'] = 'Add category';
$string['savecategory'] = 'Save category';
$string['selectcategory'] = 'Choose a category';
$string['category_deleted'] = 'Category deleted.';
$string['searchfields'] = 'Find a field';
$string['searchvariables'] = 'Find a variable';
$string['savefailed'] = 'Could not save changes. Try again.';
$string['emptyresults'] = 'No results';
$string['choose'] = 'Choose a field';
$string['openactivity'] = 'Open resource';
$string['categorysort'] = 'Display order';
$string['duplicatecategory'] = 'A category already uses this name.';
$string['deletecategoryheading'] = 'Delete {$a}?';
$string['deletecategoryinfo'] = 'This category contains {$a} fields. Choose what to do with them.';
$string['movecategoryfields'] = 'Move fields to';
$string['archivecategoryfields'] = 'Keep fields inactive';
$string['emptycategories'] = 'There are no categories. Add a category to group resource fields.';
$string['disabled'] = 'Disabled';
$string['subplugintype_smarturlplayer'] = 'Smart URL player';
$string['subplugintype_smarturlplayer_plural'] = 'Smart URL players';
$string['subplugintype_smarturlmeta'] = 'Smart URL metadata type';
$string['subplugintype_smarturlmeta_plural'] = 'Smart URL metadata types';
$string['invalidmetadata'] = 'Enter a value for the {$a} field type.';
$string['confirmdelete'] = 'Delete “{$a}”? You can disable it to keep its configuration.';
$string['newfield'] = 'Add field';
$string['newvariable'] = 'Add variable';
$string['eventresourceopened'] = 'Smart URL resource opened';
$string['selectresource'] = 'Choose a resource';
$string['subplugintype_smarturlsource'] = 'Smart URL resource catalogue';
$string['subplugintype_smarturlsource_plural'] = 'Smart URL resource catalogues';
