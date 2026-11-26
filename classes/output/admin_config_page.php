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

use core\output\react_component_renderable;
use mod_smarturl\local\metadata\metadata_type_manager;
use mod_smarturl\local\metadata\param_def_manager;

/**
 * Renders the Didactika-styled schema & dynamic parameter configuration studio (Moodle 5.3+).
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class admin_config_page implements react_component_renderable, \renderable {
    /**
     * Component name mounted by core/react_autoinit.
     *
     * @return string
     */
    #[\Override]
    public function get_react_component_name(): string {
        return 'mod_smarturl/AdminConfig';
    }

    /**
     * Initial props passed to AdminConfig.tsx.
     *
     * @param \renderer_base $renderer Renderer.
     * @return \stdClass
     */
    #[\Override]
    public function get_react_component_props(\renderer_base $renderer): \stdClass {
        return (object)[
            'title' => get_string('adminconfigtitle', 'smarturl'),
            'subtitle' => get_string('adminconfigsubtitle', 'smarturl'),
            'settingsUrl' => (new \moodle_url('/admin/settings.php', ['section' => 'modsettingsmarturl']))->out(false),
            'metaTypes' => array_map(static fn($mt) => (array)$mt, metadata_type_manager::list_all(false)),
            'paramDefs' => array_map(static fn($pd) => (array)$pd, param_def_manager::list_all(false)),
            'datatypes' => array_merge(
                metadata_type_manager::DATATYPES,
                array_keys(\mod_smarturl\local\metadata\field_types::extensions()),
            ),
            'priorities' => metadata_type_manager::PRIORITIES,
            'sourceTypes' => param_def_manager::SOURCE_TYPES,
            'sourceOptions' => array_map(static fn($options) => (object)$options, param_def_manager::source_options()),
            'categories' => array_values(\mod_smarturl\local\metadata\category_manager::all()),
            'strings' => [
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
            ],
        ];
    }
}
