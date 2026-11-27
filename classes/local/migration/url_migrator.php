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

namespace mod_smarturl\local\migration;

use mod_smarturl\local\compat\course_module_actions;
use mod_smarturl\local\policy\policy_manager;

/**
 * Selective event-emitting migrator from core mod_url to mod_smarturl.
 *
 * Creates replacement Smart URL instances via add_moduleinfo(), replays student completions through
 * completion_info::update_state(), rewires completion dependencies, and deletes legacy mod_url records
 * via core deletion APIs so Moodle Event Bus / Overwatch observe every lifecycle change cleanly.
 *
 * @package    mod_smarturl
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class url_migrator {
    /**
     * Runs selective migration or dry-run inspection.
     *
     * @param array $options Selection and behavior flags.
     * @return array<string, mixed> Migration summary report.
     */
    public static function run(array $options): array {
        global $CFG, $DB;

        require_once($CFG->dirroot . '/course/modlib.php');
        require_once($CFG->dirroot . '/course/lib.php');
        require_once($CFG->libdir . '/completionlib.php');

        $hasfilter = !empty($options['courseid'])
            || !empty($options['categoryid'])
            || !empty($options['cmids'])
            || !empty($options['idnumberprefix'])
            || !empty($options['urlpattern']);

        if (!$hasfilter && empty($options['allurls'])) {
            throw new \invalid_parameter_exception(
                'Specify --courseid, --categoryid, --cmids, --idnumber-prefix, --url-pattern or --all-urls.'
            );
        }

        $dryrun = !empty($options['dryrun']);
        $managedby = !empty($options['managedby']) ? (string)$options['managedby'] : null;

        $urlmoduleid = (int)$DB->get_field('modules', 'id', ['name' => 'url'], MUST_EXIST);
        $clauses = ['module = :urlmoduleid', 'deletioninprogress = 0'];
        $params = ['urlmoduleid' => $urlmoduleid];

        if (!empty($options['courseid'])) {
            $clauses[] = 'course = :courseid';
            $params['courseid'] = (int)$options['courseid'];
        }
        if (!empty($options['categoryid'])) {
            $courseids = $DB->get_fieldset_select(
                'course',
                'id',
                'category = :categoryid',
                ['categoryid' => (int)$options['categoryid']],
            );
            if (empty($courseids)) {
                return [
                    'dryrun' => $dryrun,
                    'matched' => 0,
                    'migrated' => 0,
                    'completions' => 0,
                    'rewired' => 0,
                    'items' => [],
                ];
            }
            [$cinsql, $cinparams] = $DB->get_in_or_equal($courseids, SQL_PARAMS_NAMED, 'catc');
            $clauses[] = "course $cinsql";
            $params = array_merge($params, $cinparams);
        }
        if (!empty($options['cmids'])) {
            $cmids = array_values(array_filter(array_map('intval', (array)$options['cmids']), static fn($id) => $id > 0));
            if (empty($cmids)) {
                return [
                    'dryrun' => $dryrun,
                    'matched' => 0,
                    'migrated' => 0,
                    'completions' => 0,
                    'rewired' => 0,
                    'items' => [],
                ];
            }
            [$insql, $inparams] = $DB->get_in_or_equal($cmids, SQL_PARAMS_NAMED, 'cm');
            $clauses[] = "id $insql";
            $params = array_merge($params, $inparams);
        }
        if (!empty($options['idnumberprefix'])) {
            $clauses[] = $DB->sql_like('idnumber', ':idprefix', false, false);
            $params['idprefix'] = $DB->sql_like_escape((string)$options['idnumberprefix']) . '%';
        }

        $cmrows = $DB->get_records_select(
            'course_modules',
            implode(' AND ', $clauses),
            $params,
            'course ASC, section ASC, id ASC'
        );
        if (empty($cmrows)) {
            return ['dryrun' => $dryrun, 'matched' => 0, 'migrated' => 0, 'completions' => 0, 'rewired' => 0, 'items' => []];
        }

        $urlids = array_values(array_unique(array_map(static fn($cm) => (int)$cm->instance, $cmrows)));
        $secids = array_values(array_unique(array_map(static fn($cm) => (int)$cm->section, $cmrows)));
        $urlrecords = $DB->get_records_list('url', 'id', $urlids);
        $secrecords = $DB->get_records_list('course_sections', 'id', $secids, '', 'id, section');

        $candidates = [];
        foreach ($cmrows as $cm) {
            $u = $urlrecords[(int)$cm->instance] ?? null;
            $sec = $secrecords[(int)$cm->section] ?? null;
            if (!$u || !$sec) {
                continue;
            }
            $candidates[] = (object)[
                'cmid' => (int)$cm->id,
                'course' => (int)$cm->course,
                'section' => (int)$cm->section,
                'idnumber' => (string)($cm->idnumber ?? ''),
                'visible' => (int)$cm->visible,
                'visibleoncoursepage' => (int)$cm->visibleoncoursepage,
                'availability' => $cm->availability,
                'showdescription' => (int)$cm->showdescription,
                'completion' => (int)$cm->completion,
                'completionview' => (int)$cm->completionview,
                'completionexpected' => (int)$cm->completionexpected,
                'groupmode' => (int)$cm->groupmode,
                'groupingid' => (int)$cm->groupingid,
                'sectionnum' => (int)$sec->section,
                'urlid' => (int)$u->id,
                'name' => (string)$u->name,
                'intro' => (string)($u->intro ?? ''),
                'introformat' => (int)$u->introformat,
                'externalurl' => (string)$u->externalurl,
                'display' => (int)$u->display,
                'displayoptions' => $u->displayoptions,
                'parameters' => $u->parameters,
            ];
        }
        usort($candidates, static fn($a, $b) => ($a->course <=> $b->course)
            ?: ($a->sectionnum <=> $b->sectionnum)
            ?: ($a->cmid <=> $b->cmid));

        if (!empty($options['urlpattern'])) {
            $pattern = (string)$options['urlpattern'];
            $candidates = array_values(array_filter($candidates, static function ($row) use ($pattern): bool {
                if (@preg_match($pattern, '') !== false) {
                    return (bool)preg_match($pattern, (string)$row->externalurl);
                }
                return str_contains((string)$row->externalurl, $pattern);
            }));
        }

        $smarturlmodule = $DB->get_record('modules', ['name' => 'smarturl'], '*', MUST_EXIST);
        $report = [
            'dryrun' => $dryrun,
            'matched' => count($candidates),
            'migrated' => 0,
            'completions' => 0,
            'rewired' => 0,
            'items' => [],
        ];

        $coursesdirty = [];
        foreach ($candidates as $row) {
            $compcount = $DB->count_records('course_modules_completion', ['coursemoduleid' => $row->cmid]);
            if ($dryrun) {
                $report['completions'] += $compcount;
                $report['items'][] = [
                    'oldcmid' => (int)$row->cmid,
                    'courseid' => (int)$row->course,
                    'name' => $row->name,
                    'idnumber' => $row->idnumber,
                    'completions' => $compcount,
                ];
                continue;
            }

            $course = $DB->get_record('course', ['id' => $row->course], '*', MUST_EXIST);
            $oldcmid = (int)$row->cmid;
            $savedidnumber = (string)($row->idnumber ?? '');

            // Clear old idnumber first so add_moduleinfo() can assign it cleanly without unique-key collision.
            if ($savedidnumber !== '') {
                $DB->set_field('course_modules', 'idnumber', '', ['id' => $oldcmid]);
            }

            $disp = self::map_display((int)$row->display, (string)$row->displayoptions);
            $moduleinfo = (object)[
                'modulename' => 'smarturl',
                'module' => (int)$smarturlmodule->id,
                'course' => (int)$course->id,
                'section' => (int)$row->sectionnum,
                'name' => $row->name,
                'intro' => (string)$row->intro,
                'introformat' => (int)$row->introformat,
                'introeditor' => [
                    'text' => (string)$row->intro,
                    'format' => (int)$row->introformat,
                    'itemid' => 0,
                ],
                'externalurl' => (string)$row->externalurl,
                'display_mode' => $disp['mode'],
                'popup_width' => $disp['popupwidth'],
                'popup_height' => $disp['popupheight'],
                'aspect_ratio' => '16:9',
                'showdescription' => (int)$row->showdescription,
                'visible' => (int)$row->visible,
                'visibleoncoursepage' => (int)$row->visibleoncoursepage,
                'cmidnumber' => $savedidnumber,
                'availabilityconditionsjson' => $row->availability ?: '',
                'completion' => (int)$row->completion,
                'completionview' => (int)$row->completionview,
                'completionexpected' => (int)$row->completionexpected,
                'groupmode' => (int)$row->groupmode,
                'groupingid' => (int)$row->groupingid,
                'parameters_json' => self::convert_legacy_parameters((string)$row->parameters),
            ];

            $created = add_moduleinfo($moduleinfo, $course);
            $newcmid = (int)$created->coursemodule;
            $newinstanceid = (int)$created->instance;

            self::place_before_legacy((int)$row->section, $newcmid, $oldcmid);
            self::copy_intro_files(\context_module::instance($oldcmid), \context_module::instance($newcmid));

            if ($managedby !== null || $savedidnumber !== '') {
                policy_manager::upsert_external($newinstanceid, $newcmid, [
                    'managedby' => $managedby,
                    'externalkey' => $savedidnumber !== '' ? $savedidnumber : null,
                    'managedavailability' => $row->availability ?: null,
                    'lockedfields' => $managedby ? ['externalurl'] : [],
                ]);
            }

            // Replay student completion records through official Moodle API so completion events fire cleanly.
            $completioninfo = new \completion_info($course);
            $newcm = get_fast_modinfo($course)->get_cm($newcmid);
            $completions = $DB->get_records('course_modules_completion', ['coursemoduleid' => $oldcmid]);
            foreach ($completions as $comp) {
                $targetstate = (int)$comp->completionstate > 0 ? COMPLETION_COMPLETE : COMPLETION_INCOMPLETE;
                $completioninfo->update_state($newcm, $targetstate, (int)$comp->userid, true);
                if (!empty($comp->timemodified)) {
                    $DB->set_field('course_modules_completion', 'timemodified', (int)$comp->timemodified, [
                        'coursemoduleid' => $newcmid,
                        'userid' => (int)$comp->userid,
                    ]);
                }
                $report['completions']++;
            }

            $report['rewired'] += self::rewire_completion_dependencies((int)$course->id, $oldcmid, $newcmid);

            course_module_actions::delete((int)$course->id, $oldcmid);
            $coursesdirty[(int)$course->id] = true;
            $report['migrated']++;
            $report['items'][] = [
                'oldcmid' => $oldcmid,
                'newcmid' => $newcmid,
                'smarturlid' => $newinstanceid,
                'courseid' => (int)$course->id,
                'completions' => count($completions),
            ];
        }

        foreach (array_keys($coursesdirty) as $cid) {
            rebuild_course_cache($cid, true);
        }

        return $report;
    }

    /**
     * Maps core mod_url display integers and displayoptions into Smart URL display fields.
     *
     * @param int $display Core RESOURCELIB_DISPLAY_* integer.
     * @param string $optionsraw Serialized mod_url displayoptions.
     * @return array{mode: string, popupwidth: int, popupheight: int}
     */
    private static function map_display(int $display, string $optionsraw): array {
        $opts = @unserialize($optionsraw);
        $opts = is_array($opts) ? $opts : [];
        $mode = match ($display) {
            1 => 'EMBED',
            3 => 'NEW',
            5 => 'OPEN',
            6 => 'POPUP',
            default => 'AUTO',
        };
        return [
            'mode' => $mode,
            'popupwidth' => !empty($opts['popupwidth']) ? (int)$opts['popupwidth'] : 1200,
            'popupheight' => !empty($opts['popupheight']) ? (int)$opts['popupheight'] : 800,
        ];
    }

    /**
     * Converts serialized mod_url parameters into Smart URL JSON parameter bindings.
     *
     * @param string $raw Serialized mod_url.parameters string.
     * @return string|null JSON bindings string or null.
     */
    private static function convert_legacy_parameters(string $raw): ?string {
        if (trim($raw) === '') {
            return null;
        }
        $legacy = @unserialize($raw);
        if (!is_array($legacy) || empty($legacy)) {
            return null;
        }
        $map = [
            'courseid' => 'course_id',
            'courseshortname' => 'course_shortname',
            'courseidnumber' => 'course_idnumber',
            'userid' => 'user_id',
            'userusername' => 'user_username',
            'useremail' => 'user_email',
            'useridnumber' => 'user_idnumber',
            'lang' => 'user_lang',
            'sitename' => 'site_url',
        ];
        $bindings = [];
        foreach ($legacy as $param => $var) {
            $norm = $map[strtolower((string)$var)] ?? '';
            if ($norm !== '') {
                $bindings[] = ['param' => (string)$param, 'mode' => 'def', 'var' => $norm, 'value' => ''];
            }
        }
        return empty($bindings) ? null : json_encode($bindings, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Moves newcmid right next to oldcmid inside section sequence before oldcmid is deleted.
     *
     * @param int $sectionid Section ID.
     * @param int $newcmid New course module ID.
     * @param int $oldcmid Legacy course module ID.
     */
    private static function place_before_legacy(int $sectionid, int $newcmid, int $oldcmid): void {
        global $DB;
        $sequence = (string)$DB->get_field('course_sections', 'sequence', ['id' => $sectionid]);
        if ($sequence === '') {
            return;
        }
        $ids = array_values(array_filter(array_map('intval', explode(',', $sequence)), static fn($v) => $v !== $newcmid));
        $out = [];
        foreach ($ids as $id) {
            if ($id === $oldcmid) {
                $out[] = $newcmid;
            }
            $out[] = $id;
        }
        if (!in_array($newcmid, $out, true)) {
            $out[] = $newcmid;
        }
        $DB->set_field('course_sections', 'sequence', implode(',', $out), ['id' => $sectionid]);
    }

    /**
     * Copies intro files from the legacy mod_url module context to the new mod_smarturl context.
     *
     * @param \context_module $from Legacy context.
     * @param \context_module $to New context.
     */
    private static function copy_intro_files(\context_module $from, \context_module $to): void {
        $fs = get_file_storage();
        foreach ($fs->get_area_files($from->id, 'mod_url', 'intro', 0, 'id ASC', false) as $file) {
            $record = [
                'contextid' => $to->id,
                'component' => 'mod_smarturl',
                'filearea' => 'intro',
                'itemid' => 0,
                'filepath' => $file->get_filepath(),
                'filename' => $file->get_filename(),
            ];
            if (
                !$fs->file_exists(
                    $record['contextid'],
                    $record['component'],
                    $record['filearea'],
                    0,
                    $record['filepath'],
                    $record['filename'],
                )
            ) {
                $fs->create_file_from_storedfile($record, $file);
            }
        }
    }

    /**
     * Updates course_modules.availability and course_completion_criteria referencing the legacy cmid.
     *
     * @param int $courseid Course ID.
     * @param int $oldcmid Legacy cmid.
     * @param int $newcmid Replacement cmid.
     * @return int Number of updated availability references.
     */
    private static function rewire_completion_dependencies(int $courseid, int $oldcmid, int $newcmid): int {
        global $DB;

        $rewired = 0;
        $modules = $DB->get_records_select(
            'course_modules',
            'course = :courseid AND availability IS NOT NULL',
            ['courseid' => $courseid],
            'id ASC',
            'id, availability'
        );
        foreach ($modules as $mod) {
            $tree = json_decode((string)$mod->availability, true);
            if (!is_array($tree)) {
                continue;
            }
            $changed = false;
            $walker = static function (&$node) use (&$walker, &$changed, $oldcmid, $newcmid): void {
                if (!is_array($node)) {
                    return;
                }
                if (($node['type'] ?? '') === 'completion' && isset($node['cm']) && (int)$node['cm'] === $oldcmid) {
                    $node['cm'] = $newcmid;
                    $changed = true;
                }
                if (isset($node['c']) && is_array($node['c'])) {
                    foreach ($node['c'] as &$child) {
                        $walker($child);
                    }
                }
            };
            $walker($tree);
            if ($changed) {
                $DB->set_field(
                    'course_modules',
                    'availability',
                    json_encode($tree, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    ['id' => $mod->id],
                );
                $rewired++;
            }
        }

        $criteria = $DB->get_records('course_completion_criteria', [
            'course' => $courseid,
            'criteriatype' => 4,
            'module' => 'url',
            'moduleinstance' => $oldcmid,
        ]);
        foreach ($criteria as $criterion) {
            $criterion->module = 'smarturl';
            $criterion->moduleinstance = $newcmid;
            $DB->update_record('course_completion_criteria', $criterion);
        }

        return $rewired;
    }
}
