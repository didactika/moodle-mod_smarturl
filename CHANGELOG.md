# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0-m405] - 2026-11-26

### Added
- Initial release of `mod_smarturl` for Moodle 4.5 (`MOODLE_405_STABLE` line).
- Normalized database schema for activity instances, dynamic URL parameter definitions, configurable metadata types, high-volume metadata values, and external policy governance.
- Native `moodleform_mod` with policy field-locking, granular capabilities, and two-branch `availability` composition.
- Didactika Design System UI implemented with Mustache templates and ES6 AMD modules (`resource_view` and `admin_config`).
- Extensible completion architecture via `smarturlcomp_*` subplugins and PSR-14 hooks.
- Full external REST Web Services, backup/restore, Privacy API, PHPUnit tests, and selective event-emitting `cli/migrate_from_url.php`.

- Add independent course and viewer presentations, including a compact external tab and window.
- Render audio, documents, images, websites, and normalised YouTube links.
- Add categories, draft previews, translated content, site defaults, and file type icon controls.
- Manage installed player, metadata, catalogue and completion extensions from site administration.
- Consolidate editor reads and batch resource writes while preserving existing integration calls.
- Load external resources on click after Moodle checks access.
- Add `policy_manager::raise_local_revision()`, so another plugin that counts the changes of the same course module raises the local revision of its policy, never lowering it.
- Show the description in the course information dialog and group metadata on the resource page.
