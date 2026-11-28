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
 * Selective CLI migrator from mod_url to mod_smarturl emitting official Moodle events.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('CLI_SCRIPT', true);

require(__DIR__ . '/../../../config.php');
require_once($CFG->libdir . '/clilib.php');

use mod_smarturl\local\migration\url_migrator;

[$options, $unrecognized] = cli_get_params(
    [
        'help' => false,
        'dry-run' => false,
        'courseid' => 0,
        'categoryid' => 0,
        'cmids' => '',
        'idnumber-prefix' => '',
        'url-pattern' => '',
        'managed-by' => '',
        'all-urls' => false,
    ],
    ['h' => 'help']
);

if (!empty($unrecognized)) {
    cli_error(get_string('cliunknowoption', 'admin', implode("\n  ", $unrecognized)));
}

if (!empty($options['help'])) {
    echo "Selective event-emitting migrator from mod_url to mod_smarturl.\n\n"
        . "Options:\n"
        . "  --dry-run                  Simulate without writing or deleting modules.\n"
        . "  --courseid=<id>            Filter by course ID.\n"
        . "  --categoryid=<id>          Filter by course category ID.\n"
        . "  --cmids=1,2,3              Filter explicit course module IDs.\n"
        . "  --idnumber-prefix=<str>    Migrate only mod_url rows with matching cm.idnumber prefix (e.g. ekko-).\n"
        . "  --url-pattern=<str|regex>  Filter by external URL substring or PCRE regex.\n"
        . "  --managed-by=<name>        Populate smarturl_policy.managed_by (e.g. ekko).\n"
        . "  --all-urls                 Required explicitly to run without any selector filter.\n"
        . "  -h, --help                 Show this help.\n";
    exit(0);
}

$cmids = $options['cmids'] !== '' ? array_map('intval', explode(',', (string)$options['cmids'])) : [];

$report = url_migrator::run([
    'dryrun' => !empty($options['dry-run']),
    'courseid' => (int)$options['courseid'],
    'categoryid' => (int)$options['categoryid'],
    'cmids' => $cmids,
    'idnumberprefix' => (string)$options['idnumber-prefix'],
    'urlpattern' => (string)$options['url-pattern'],
    'managedby' => (string)$options['managed-by'],
    'allurls' => !empty($options['all-urls']),
]);

echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
