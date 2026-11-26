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

namespace mod_smarturl\output;

use core\output\named_templatable;
use mod_smarturl\local\metadata\metadata_type_manager;
use mod_smarturl\local\metadata\param_def_manager;

/**
 * Renders the Didactika-styled schema & dynamic parameter studio via Mustache + AMD (Moodle 4.5 - 5.2).
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class admin_config_page implements named_templatable, \renderable {
    /**
     * Returns the Mustache template name.
     *
     * @param \renderer_base $renderer Renderer.
     * @return string
     */
    public function get_template_name(\renderer_base $renderer): string {
        return 'mod_smarturl/admin_config';
    }

    /**
     * Exports template variables and initial JSON data for AMD interaction.
     *
     * @param \renderer_base $output Renderer.
     * @return array<string, mixed>
     */
    public function export_for_template(\renderer_base $output): array {
        $metatypes = array_values(array_map(static fn($mt) => (array)$mt, metadata_type_manager::list_all(false)));
        $paramdefs = array_values(array_map(static fn($pd) => (array)$pd, param_def_manager::list_all(false)));

        $strings = [
            'metadatatypes' => get_string('metadatatypes', 'smarturl'),
            'paramdefs' => get_string('paramdefs', 'smarturl'),
            'addmetatype' => get_string('addmetatype', 'smarturl'),
            'addparamdef' => get_string('addparamdef', 'smarturl'),
            'testresolution' => get_string('testresolution', 'smarturl'),
            'shortname' => get_string('shortname', 'smarturl'),
            'groupname' => get_string('groupname', 'smarturl'),
            'datatype' => get_string('datatype', 'smarturl'),
            'priority' => get_string('priority', 'smarturl'),
            'searchable' => get_string('searchable', 'smarturl'),
            'filterable' => get_string('filterable', 'smarturl'),
            'enabled' => get_string('enabled', 'smarturl'),
            'disabled' => get_string('disabled', 'smarturl'),
            'sourcetype' => get_string('sourcetype', 'smarturl'),
            'sourcekey' => get_string('sourcekey', 'smarturl'),
            'defaultqueryparam' => get_string('defaultqueryparam', 'smarturl'),
            'savechanges' => get_string('savechanges', 'moodle'),
            'cancel' => get_string('cancel'),
            'previous' => get_string('previous'),
            'next' => get_string('next'),
            'savefailed' => get_string('savefailed', 'smarturl'),
            'name' => get_string('name'),
            'settings' => get_string('settings'),
            'confirmdelete' => get_string('confirmdelete', 'smarturl'),
            'search' => get_string('search'),
            'emptyresults' => get_string('emptyresults', 'smarturl'),
            'category' => get_string('category', 'smarturl'),
            'clearfilters' => get_string('clearfilters', 'smarturl'),
            'newfield' => get_string('newfield', 'smarturl'),
            'newvariable' => get_string('newvariable', 'smarturl'),
            'delete' => get_string('delete', 'moodle'),
            'edit' => get_string('edit', 'moodle'),
        ];

        $payload = [
            'metaTypes' => $metatypes,
            'paramDefs' => $paramdefs,
            'datatypes' => array_merge(
                metadata_type_manager::DATATYPES,
                array_keys(\mod_smarturl\local\metadata\field_types::extensions()),
            ),
            'priorities' => metadata_type_manager::PRIORITIES,
            'sourceTypes' => param_def_manager::SOURCE_TYPES,
            'sourceOptions' => array_map(static fn($options) => (object)$options, param_def_manager::source_options()),
            'categories' => array_values(\mod_smarturl\local\metadata\category_manager::all()),
            'strings' => $strings,
        ];

        return [
            'title' => get_string('adminconfigtitle', 'smarturl'),
            'subtitle' => get_string('adminconfigsubtitle', 'smarturl'),
            'categories' => $payload['categories'],
            'settingsurl' => (new \moodle_url('/admin/settings.php', ['section' => 'modsettingsmarturl']))->out(false),
            'datatypes' => array_map(
                static fn($dt) => ['value' => $dt],
                array_merge(metadata_type_manager::DATATYPES, array_keys(\mod_smarturl\local\metadata\field_types::extensions())),
            ),
            'priorities' => array_map(static fn($pr) => ['value' => $pr], metadata_type_manager::PRIORITIES),
            'sourcetypes' => array_map(static fn($st) => ['value' => $st], param_def_manager::SOURCE_TYPES),
            'strings' => $strings,
            'payloadjson' => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ];
    }
}
