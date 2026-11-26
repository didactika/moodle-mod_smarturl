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

use mod_smarturl\local\metadata\metadata_repository;

/**
 * Structure step to restore a mod_smarturl activity.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class restore_smarturl_activity_structure_step extends restore_activity_structure_step {
    /** @var array<int, array{key: string, value: string}> */
    private array $metadatabuffer = [];

    /** @var object|null */
    private ?object $policybuffer = null;

    /**
     * Defines restore paths.
     *
     * @return array
     */
    protected function define_structure(): array {
        $smarturl = new restore_path_element('smarturl', '/activity/smarturl');
        $metavalue = new restore_path_element('metavalue', '/activity/smarturl/metavalues/metavalue');
        $policy = new restore_path_element('policy', '/activity/smarturl/policies/policy');

        $this->add_subplugin_structure('smarturlcomp', $smarturl);

        return $this->prepare_activity_structure([$smarturl, $metavalue, $policy]);
    }

    /**
     * Restores base smarturl record.
     *
     * @param array<string, mixed> $data Backup row data.
     */
    protected function process_smarturl($data): void {
        global $DB;

        $data = (object)$data;
        $data->course = $this->get_courseid();
        $newitemid = $DB->insert_record('smarturl', $data);
        $this->apply_activity_instance($newitemid);
    }

    /**
     * Buffers metadata entry until files/cmid are finalized.
     *
     * @param array<string, mixed> $data Backup metadata entry.
     */
    protected function process_metavalue($data): void {
        $data = (object)$data;
        if (!empty($data->key) && isset($data->value_text)) {
            $this->metadatabuffer[] = ['key' => (string)$data->key, 'value' => (string)$data->value_text];
        }
    }

    /**
     * Buffers policy record.
     *
     * @param array<string, mixed> $data Backup policy row.
     */
    protected function process_policy($data): void {
        $this->policybuffer = (object)$data;
    }

    /**
     * Restores files, metadata entries and policy linkage with the newly assigned cmid.
     */
    protected function after_execute(): void {
        global $DB;

        $this->add_related_files('mod_smarturl', 'intro', null);
        $this->add_related_files('mod_smarturl', 'poster', null);

        $smarturlid = (int)$this->get_new_parentid('smarturl');
        if ($smarturlid > 0 && !empty($this->metadatabuffer)) {
            metadata_repository::replace_for_instance($smarturlid, $this->metadatabuffer);
        }

        if ($smarturlid > 0 && $this->policybuffer !== null) {
            $cmid = (int)$this->task->get_moduleid();
            $rec = clone $this->policybuffer;
            unset($rec->id);
            $rec->smarturlid = $smarturlid;
            $rec->cmid = $cmid;
            $rec->last_modified_by = null;
            $rec->timemodified = time();
            $DB->insert_record('smarturl_policy', $rec);
        }
    }
}
