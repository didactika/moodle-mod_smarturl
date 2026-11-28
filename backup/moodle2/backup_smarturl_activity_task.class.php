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

require_once($CFG->dirroot . '/mod/smarturl/backup/moodle2/backup_smarturl_stepslib.php');

/**
 * Backup task for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class backup_smarturl_activity_task extends backup_activity_task {
    /**
     * Defines task settings.
     */
    protected function define_my_settings(): void {
    }

    /**
     * Adds structure step.
     */
    protected function define_my_steps(): void {
        $this->add_step(new backup_smarturl_activity_structure_step('smarturl_structure', 'smarturl.xml'));
    }

    /**
     * Encodes internal URLs for portable backup.
     *
     * @param string $content Content text.
     * @return string
     */
    public static function encode_content_links($content): string {
        global $CFG;

        $base = preg_quote($CFG->wwwroot . '/mod/smarturl', '#');
        $content = preg_replace('#(' . $base . '/index\.php\?id=)([0-9]+)#', '$@SMARTURLINDEX*$2@$', $content);
        $content = preg_replace('#(' . $base . '/view\.php\?id=)([0-9]+)#', '$@SMARTURLVIEWBYID*$2@$', $content);
        $content = preg_replace('#(' . $base . '/view\.php\?s=)([0-9]+)#', '$@SMARTURLVIEWBYS*$2@$', $content);

        return $content;
    }
}
