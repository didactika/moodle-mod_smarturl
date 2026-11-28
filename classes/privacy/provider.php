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

namespace mod_smarturl\privacy;

use core_privacy\local\metadata\collection;
use core_privacy\local\request\approved_contextlist;
use core_privacy\local\request\approved_userlist;
use core_privacy\local\request\contextlist;
use core_privacy\local\request\transform;
use core_privacy\local\request\userlist;
use core_privacy\local\request\writer;

/**
 * Privacy Subsystem implementation for mod_smarturl.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class provider implements
    \core_privacy\local\metadata\provider,
    \core_privacy\local\request\core_userlist_provider,
    \core_privacy\local\request\plugin\provider {
    /**
     * Describes stored user data.
     *
     * @param collection $collection Collection to populate.
     * @return collection
     */
    public static function get_metadata(collection $collection): collection {
        $collection->add_database_table('smarturl_policy', [
            'last_modified_by' => 'privacy:metadata:policy:last_modified_by',
            'timemodified' => 'privacy:metadata:policy:timemodified',
        ], 'privacy:metadata:policy');

        return $collection;
    }

    /**
     * Finds contexts containing personal data for a user.
     *
     * @param int $userid User ID.
     * @return contextlist
     */
    public static function get_contexts_for_userid(int $userid): contextlist {
        $contextlist = new contextlist();
        $sql = "SELECT ctx.id
                  FROM {context} ctx
                  JOIN {course_modules} cm ON cm.id = ctx.instanceid AND ctx.contextlevel = :contextlevel
                  JOIN {smarturl_policy} sp ON sp.cmid = cm.id
                 WHERE sp.last_modified_by = :userid";
        $contextlist->add_from_sql($sql, ['contextlevel' => CONTEXT_MODULE, 'userid' => $userid]);
        return $contextlist;
    }

    /**
     * Collects user IDs within a context.
     *
     * @param userlist $userlist User list.
     */
    public static function get_users_in_context(userlist $userlist): void {
        $context = $userlist->get_context();
        if (!$context instanceof \context_module) {
            return;
        }
        $sql = "SELECT sp.last_modified_by AS userid
                  FROM {smarturl_policy} sp
                 WHERE sp.cmid = :cmid AND sp.last_modified_by IS NOT NULL";
        $userlist->add_from_sql('userid', $sql, ['cmid' => $context->instanceid]);
    }

    /**
     * Exports personal data for approved contexts.
     *
     * @param approved_contextlist $contextlist Approved contexts.
     */
    public static function export_user_data(approved_contextlist $contextlist): void {
        global $DB;

        $userid = (int)$contextlist->get_user()->id;
        foreach ($contextlist->get_contexts() as $context) {
            if (!$context instanceof \context_module) {
                continue;
            }
            $policy = $DB->get_record('smarturl_policy', [
                'cmid' => $context->instanceid,
                'last_modified_by' => $userid,
            ]);
            if ($policy) {
                writer::with_context($context)->export_data(
                    [get_string('pluginname', 'smarturl')],
                    (object)[
                        'last_modified_by' => $policy->last_modified_by,
                        'timemodified' => transform::datetime((int)$policy->timemodified),
                    ]
                );
            }
        }
    }

    /**
     * Anonymizes user ID references for a single context.
     *
     * @param \context $context Context.
     */
    public static function delete_data_for_all_users_in_context(\context $context): void {
        global $DB;
        if ($context instanceof \context_module) {
            $DB->set_field('smarturl_policy', 'last_modified_by', null, ['cmid' => $context->instanceid]);
        }
    }

    /**
     * Anonymizes user ID references for one user.
     *
     * @param approved_contextlist $contextlist Approved contexts.
     */
    public static function delete_data_for_user(approved_contextlist $contextlist): void {
        global $DB;
        $userid = (int)$contextlist->get_user()->id;
        foreach ($contextlist->get_contexts() as $context) {
            if ($context instanceof \context_module) {
                $DB->set_field('smarturl_policy', 'last_modified_by', null, [
                    'cmid' => $context->instanceid,
                    'last_modified_by' => $userid,
                ]);
            }
        }
    }

    /**
     * Anonymizes user ID references for a list of users in a context.
     *
     * @param approved_userlist $userlist Approved users.
     */
    public static function delete_data_for_users(approved_userlist $userlist): void {
        global $DB;
        $context = $userlist->get_context();
        if (!$context instanceof \context_module) {
            return;
        }
        $userids = $userlist->get_userids();
        if (empty($userids)) {
            return;
        }
        [$insql, $params] = $DB->get_in_or_equal($userids, SQL_PARAMS_NAMED);
        $params['cmid'] = $context->instanceid;
        $DB->set_field_select('smarturl_policy', 'last_modified_by', null, "cmid = :cmid AND last_modified_by $insql", $params);
    }
}
