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

namespace mod_smarturl\local\permissions;

/**
 * Capability evaluator with configurable restrictions for site administrators.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class admin_permissions {
    /** @var array<string, string> Capabilities controllable in site settings for site admins. */
    public const CAPABILITIES = [
        'mod/smarturl:editgeneral' => 'adminperm_editgeneral',
        'mod/smarturl:editurl' => 'adminperm_editurl',
        'mod/smarturl:editdisplay' => 'adminperm_editdisplay',
        'mod/smarturl:editcompletion' => 'adminperm_editcompletion',
        'mod/smarturl:editavailability' => 'adminperm_editavailability',
        'mod/smarturl:overrideavailability' => 'adminperm_overrideavailability',
        'mod/smarturl:editmetadata' => 'adminperm_editmetadata',
        'mod/smarturl:reorder' => 'adminperm_reorder',
        'mod/smarturl:movesection' => 'adminperm_movesection',
        'mod/smarturl:delete' => 'adminperm_delete',
        'mod/smarturl:bypasspolicy' => 'adminperm_bypasspolicy',
    ];

    /**
     * Checks whether a user is allowed to perform a Smart URL capability in context, applying admin limits if configured.
     *
     * @param string $capability Capability name.
     * @param \context $context Context.
     * @param int|null $userid User ID (defaults to current user).
     * @return bool
     */
    public static function allows(string $capability, \context $context, ?int $userid = null): bool {
        global $USER;

        $uid = $userid ?? (int)$USER->id;
        if (!has_capability($capability, $context, $uid)) {
            return false;
        }
        if (!is_siteadmin($uid)) {
            return true;
        }

        $lockadmins = get_config('mod_smarturl', 'lockadmins');
        if (empty($lockadmins)) {
            return true;
        }

        $setting = self::CAPABILITIES[$capability] ?? null;
        if ($setting === null) {
            return true;
        }

        return (bool)get_config('mod_smarturl', $setting);
    }

    /**
     * Enforces an admin-restrictable capability, throwing required_capability_exception if denied.
     *
     * @param string $capability Capability name.
     * @param \context $context Context.
     * @param int|null $userid Optional user ID.
     */
    public static function require_capability(string $capability, \context $context, ?int $userid = null): void {
        require_capability($capability, $context, $userid);
        if (!self::allows($capability, $context, $userid)) {
            throw new \required_capability_exception($context, $capability, 'nopermissions', '');
        }
    }
}
