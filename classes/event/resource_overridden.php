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

namespace mod_smarturl\event;

/**
 * Emitted when a user modifies an externally governed Smart URL locally in Moodle.
 *
 * Routed by local_eventbus as teaching-action.moodle.resource-overridden for async reconciliation.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class resource_overridden extends \core\event\base {
    /**
     * Initializes event metadata.
     */
    protected function init(): void {
        $this->data['crud'] = 'u';
        $this->data['edulevel'] = self::LEVEL_TEACHING;
        $this->data['objecttable'] = 'smarturl';
    }

    /**
     * Localized event name.
     *
     * @return string
     */
    public static function get_name(): string {
        return get_string('eventresourceoverridden', 'smarturl');
    }

    /**
     * Event description.
     *
     * @return string
     */
    public function get_description(): string {
        return "The user with id '{$this->userid}' modified Smart URL '{$this->objectid}' in course '{$this->courseid}'.";
    }

    /**
     * Link to view the updated Smart URL.
     *
     * @return \moodle_url
     */
    public function get_url(): \moodle_url {
        return new \moodle_url('/mod/smarturl/view.php', ['id' => $this->contextinstanceid]);
    }
}
