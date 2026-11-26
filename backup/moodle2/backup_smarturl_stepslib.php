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

defined('MOODLE_INTERNAL') || die();

/**
 * Backup structure definition for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class backup_smarturl_activity_structure_step extends backup_activity_structure_step {
    /**
     * Defines backup XML tree including normalized metadata and external policy.
     *
     * @return backup_nested_element
     */
    protected function define_structure(): backup_nested_element {
        $smarturl = new backup_nested_element('smarturl', ['id'], [
            'name', 'intro', 'introformat', 'externalurl',
            'display_mode', 'popup_width', 'popup_height', 'aspect_ratio',
            'show_description', 'thumbnail_url', 'duration_seconds',
            'parameters_json', 'completion_custom_json', 'timemodified',
        ]);

        $metavalues = new backup_nested_element('metavalues');
        $metavalue = new backup_nested_element('metavalue', ['id'], [
            'key', 'value_text', 'sortorder', 'timemodified',
        ]);

        $policies = new backup_nested_element('policies');
        $policy = new backup_nested_element('policy', ['id'], [
            'managed_by', 'external_key', 'mandatory', 'locked_fields_json',
            'managed_availability_json', 'custom_availability_json',
            'local_revision', 'acked_revision', 'timemodified',
        ]);

        $smarturl->add_child($metavalues);
        $metavalues->add_child($metavalue);
        $smarturl->add_child($policies);
        $policies->add_child($policy);

        $smarturl->set_source_table('smarturl', ['id' => backup::VAR_ACTIVITYID]);
        $metavalue->set_source_sql(
            "SELECT v.id, COALESCE(t.shortname, v.custom_key) AS \"key\", v.value_text, v.sortorder, v.timemodified
               FROM {smarturl_meta_value} v
          LEFT JOIN {smarturl_meta_type} t ON t.id = v.typeid
              WHERE v.smarturlid = ?",
            [backup::VAR_PARENTID]
        );
        $policy->set_source_table('smarturl_policy', ['smarturlid' => backup::VAR_PARENTID]);

        $smarturl->annotate_files('mod_smarturl', 'intro', null);
        $smarturl->annotate_files('mod_smarturl', 'poster', null);

        $this->add_subplugin_structure('smarturlcomp', $smarturl, true);

        return $this->prepare_activity_structure($smarturl);
    }
}
