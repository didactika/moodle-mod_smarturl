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

namespace mod_smarturl\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;
use core_external\external_multiple_structure;

/**
 * Saves complete resources with an independent result and transaction per item.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class save_instances extends external_api {
    /**
     * Request contract.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'items' => new external_multiple_structure(new external_single_structure([
                'reference' => new external_value(PARAM_RAW_TRIMMED, 'Client-supplied reference'),
                'data' => new external_value(PARAM_RAW, 'One create_instances or update_instances item as JSON'),
            ])),
        ]);
    }

    /**
     * Creates or updates each item using the existing capability checks.
     *
     * @param array $items Resource records.
     * @return array
     */
    public static function execute(array $items): array {
        global $DB;
        $input = self::validate_parameters(self::execute_parameters(), ['items' => $items]);
        $context = \context_system::instance();
        self::validate_context($context);
        require_capability('mod/smarturl:manageexternal', $context);
        if (count($input['items']) > 100) {
            throw new \invalid_parameter_exception('A batch can contain up to 100 resources.');
        }
        $results = [];
        foreach ($input['items'] as $item) {
            $result = ['reference' => $item['reference'], 'cmid' => 0, 'saved' => false, 'error' => ''];
            $transaction = $DB->start_delegated_transaction();
            $lock = null;
            try {
                $data = json_decode($item['data'], true, 32, JSON_THROW_ON_ERROR);
                if (!is_array($data)) {
                    throw new \invalid_parameter_exception('Expected an object for the resource.');
                }
                $ismanaged = !empty($data['managedby']) && !empty($data['externalkey']) && !empty($data['courseid']);
                if (empty($data['cmid']) && $ismanaged) {
                    $key = hash('sha256', json_encode([$data['courseid'], $data['managedby'], $data['externalkey']]));
                    $lock = \core\lock\lock_config::get_lock_factory('mod_smarturl')->get_lock($key, 5);
                    if (!$lock) {
                        throw new \moodle_exception('locktimeout');
                    }
                    $policies = $DB->get_records(
                        'smarturl_policy',
                        ['managed_by' => $data['managedby'], 'external_key' => $data['externalkey']]
                    );
                    foreach ($policies as $policy) {
                        if ($DB->record_exists('smarturl', ['id' => $policy->smarturlid, 'course' => $data['courseid']])) {
                            $data['cmid'] = $policy->cmid;
                            unset($data['courseid'], $data['idnumber']);
                            break;
                        }
                    }
                }
                $updated = empty($data['cmid']) ? create_instances::execute([$data]) : update_instances::execute([$data]);
                $result['cmid'] = $updated[0]['cmid'];
                $result['saved'] = true;
                $transaction->allow_commit();
            } catch (\Throwable $error) {
                try {
                    $transaction->rollback($error);
                } catch (\Throwable $rolledback) {
                    $result['error'] = $rolledback instanceof \moodle_exception
                        ? $rolledback->errorcode : 'invalid_resource';
                }
            } finally {
                if ($lock) {
                    $lock->release();
                }
            }
            $results[] = $result;
        }
        return $results;
    }

    /**
     * Response contract.
     *
     * @return external_multiple_structure
     */
    public static function execute_returns(): external_multiple_structure {
        return new external_multiple_structure(new external_single_structure([
            'reference' => new external_value(PARAM_RAW_TRIMMED, 'Client reference'),
            'cmid' => new external_value(PARAM_INT, 'Activity ID when saved'),
            'saved' => new external_value(PARAM_BOOL, 'Whether the item was committed'),
            'error' => new external_value(PARAM_ALPHANUMEXT, 'Error code when the item failed'),
        ]));
    }
}
