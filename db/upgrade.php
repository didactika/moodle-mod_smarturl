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
 * Upgrade steps for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Executes upgrade steps between versions.
 *
 * @param int $oldversion Previously installed version.
 * @return bool True on completion.
 */
function xmldb_smarturl_upgrade(int $oldversion): bool {
    global $DB;

    if ($oldversion < 2026112602) {
        $manager = $DB->get_manager();
        if (!$manager->table_exists('smarturl_meta_category')) {
            $manager->install_one_table_from_xmldb_file(__DIR__ . '/install.xml', 'smarturl_meta_category');
        }
        foreach (
            [
            'smarturl' => [
                new xmldb_field('presentation_json', XMLDB_TYPE_TEXT, null, null, null, null, null, 'duration_seconds'),
                new xmldb_field('translations_json', XMLDB_TYPE_TEXT, null, null, null, null, null, 'presentation_json'),
            ],
            'smarturl_meta_type' => [
                new xmldb_field('categoryid', XMLDB_TYPE_INTEGER, '10', null, null, null, null, 'description'),
            ],
            'smarturl_meta_value' => [
                new xmldb_field('archived', XMLDB_TYPE_INTEGER, '1', null, XMLDB_NOTNULL, null, '0', 'custom_key'),
            ],
            ] as $tablename => $fields
        ) {
            $table = new xmldb_table($tablename);
            foreach ($fields as $field) {
                if (!$manager->field_exists($table, $field)) {
                    $manager->add_field($table, $field);
                }
            }
        }

        \mod_smarturl\local\metadata\category_manager::backfill();
        foreach (get_config('mod_smarturl') as $name => $value) {
            if ($name === 'lockadmins' || str_starts_with($name, 'adminperm_')) {
                unset_config($name, 'mod_smarturl');
            }
        }
        upgrade_mod_savepoint(true, 2026112602, 'smarturl');
    }
    return true;
}
