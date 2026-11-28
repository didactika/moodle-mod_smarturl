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

use core\output\plugin_renderer_base;

/**
 * Theme extension points for Smart URL screens and fragments.
 *
 * @package mod_smarturl
 * @copyright 2026 Didactika.org
 * @license https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class renderer extends plugin_renderer_base {
    /**
     * Renders the activity viewer.
     *
     * @param resource_page $page Presentation data.
     * @return string
     */
    protected function render_resource_page(resource_page $page): string {
        return $this->render_react_component($page->get_react_component_name(), $page->get_react_component_props($this));
    }

    /**
     * Renders the site catalogue.
     *
     * @param admin_config_page $page Presentation data.
     * @return string
     */
    protected function render_admin_config_page(admin_config_page $page): string {
        return $this->render_react_component($page->get_react_component_name(), $page->get_react_component_props($this));
    }

    /**
     * Renders the appearance preview button.
     *
     * @param preview_widget $page Presentation data.
     * @return string
     */
    protected function render_preview_widget(preview_widget $page): string {
        return $this->render_react_component($page->get_react_component_name(), $page->get_react_component_props($this));
    }

    /**
     * Renders the resource field and variable builder.
     *
     * @param form_builder_widget $page Presentation data.
     * @return string
     */
    protected function render_form_builder_widget(form_builder_widget $page): string {
        return $this->render_react_component($page->get_react_component_name(), $page->get_react_component_props($this));
    }

    /**
     * Renders the inline player in the course.
     *
     * @param course_preview $page Presentation data.
     * @return string
     */
    protected function render_course_preview(course_preview $page): string {
        return $this->render_react_component($page->get_react_component_name(), $page->get_react_component_props($this));
    }

    /**
     * Provides the theme hook for the site settings controls.
     *
     * @param settings_controls $page Presentation data.
     * @return string
     */
    protected function render_settings_controls(settings_controls $page): string {
        return $this->render_react_component($page->get_react_component_name(), $page->get_react_component_props($this));
    }

    /**
     * Renders the resource card on a course page.
     *
     * @param array $data Course card template data.
     * @return string
     */
    public function course_card(array $data): string {
        return $this->render_from_template('mod_smarturl/course_card', $data);
    }

    /**
     * Renders the body of the draft preview.
     *
     * @param array $data Draft preview template data.
     * @return string
     */
    public function draft_preview(array $data): string {
        return $this->render_from_template('mod_smarturl/draft_preview', $data);
    }

    /**
     * Renders information and completion tools at the resource.
     *
     * @param array $fields Visible resource metadata.
     * @param bool $course Whether this is a course item.
     * @param string $completion Moodle completion controls.
     * @param string $description Formatted course resource description.
     * @return string
     */
    public function resource_tools(array $fields, bool $course = false, string $completion = '', string $description = ''): string {
        if (!$fields && !$course && $completion === '' && $description === '') {
            return '';
        }
        $data = [
            'detailhtml' => $this->resource_details($fields, $description),
            'details' => get_string('resourceinformation', 'smarturl'),
            'hasfields' => !empty($fields) || trim($description) !== '',
            'completion' => $completion,
            'course' => $course,
        ];
        return $this->render_from_template('mod_smarturl/resource_tools', $data)
            . $this->render_react_component('mod_smarturl/ResourceTools', (object)[]);
    }

    /**
     * Renders the grouped resource data for an activity or information modal.
     *
     * @param array $fields Visible metadata.
     * @param string $description Formatted resource description.
     * @return string
     */
    public function resource_details(array $fields, string $description = ''): string {
        $groups = [];
        foreach ($fields as $field) {
            $group = $field['group'] ?: get_string('metadataheading', 'smarturl');
            if ($field['datatype'] === 'URL' && preg_match('~^https?://~i', $field['value'])) {
                $field['url'] = $field['value'];
            } else if ($field['datatype'] === 'BOOLEAN') {
                $truth = in_array(strtolower($field['value']), ['1', 'true', 'yes', 'si'], true);
                $field['value'] = get_string($truth ? 'yes' : 'no');
            }
            $groups[$group][] = $field;
        }
        return $this->render_from_template('mod_smarturl/resource_details', [
            'groups' => array_map(
                static fn($name, $items) => ['name' => $name, 'items' => $items],
                array_keys($groups),
                array_values($groups),
            ),
            'hasgroups' => !empty($groups),
            'description' => $description,
            'descriptionlabel' => get_string('description'),
        ]);
    }

    /**
     * Gets the native completion data for the compact activity tools.
     *
     * @param \cm_info $cm Activity information.
     * @param int $userid Current user.
     * @return string
     */
    public function completion_tools(\cm_info $cm, int $userid): string {
        $output = new \core_course\output\completion_status($cm, $userid);
        $data = $output->export_for_template($this);
        if (empty($data['hascompletion']) || empty($data['uservisible'])) {
            return '';
        }
        if (!empty($data['showmanualcompletion'])) {
            return \core_courseformat\local\linearnavigationsettings::show_navigation_footer($this->page)
                ? '' : $this->render_from_template('core_course/completion_manual', $data);
        }
        if (empty($data['completiondetails'])) {
            return '';
        }
        return $this->render_from_template('mod_smarturl/compact_completion', $data);
    }
}
