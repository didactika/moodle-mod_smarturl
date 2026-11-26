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
 * Records an intentional launch of an external resource or its player.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class resource_opened extends \core\event\base {
    /**
     * Sets the event classification.
     */
    protected function init(): void {
        $this->data['crud'] = 'r';
        $this->data['edulevel'] = self::LEVEL_PARTICIPATING;
        $this->data['objecttable'] = 'smarturl';
    }

    /**
     * Localised event name.
     *
     * @return string
     */
    public static function get_name(): string {
        return get_string('eventresourceopened', 'smarturl');
    }

    /**
     * Event description.
     *
     * @return string
     */
    public function get_description(): string {
        return "The user with id {$this->userid} opened the resource in Smart URL {$this->objectid}.";
    }

    /**
     * Activity URL.
     *
     * @return \moodle_url
     */
    public function get_url(): \moodle_url {
        return new \moodle_url('/mod/smarturl/view.php', ['id' => $this->contextinstanceid, 'forceview' => 1]);
    }
}
