# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0-m503] - 2026-11-26

### Added
- Initial release of `mod_smarturl` for Moodle 5.3 (`main` line).
- Normalized database schema for activity instances, dynamic URL parameter definitions, configurable metadata types, high-volume metadata values, and external policy governance.
- Native `moodleform_mod` with policy field-locking, granular capabilities, administrator restrictions, and two-branch `availability` composition.
- Didactika Design System UI in React + TypeScript (`ResourceView` and `AdminConfig`) built for Moodle 5.3 ESM.
- Extensible completion architecture via `smarturlcomp_*` subplugins and PSR-14 hooks.
- Full external REST Web Services, backup/restore, Privacy API, PHPUnit tests, and selective event-emitting `cli/migrate_from_url.php`.
