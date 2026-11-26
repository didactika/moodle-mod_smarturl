# Smart URL (`mod_smarturl`)

Moodle activity module for externally hosted resources with dynamic URL parameters, configurable typed metadata, a high-volume metadata explorer, extensible completion subplugins, external field-lock policies, and selective event-emitting migration from core `mod_url`.

Designed cleanly around the [Didactika Moodle Design System](https://moodle-design.didactika.org/) with full compatibility on **Moodle 4.5 LTS** and **Moodle 5.3+**.

## Features

- **Dynamic URL Parameters:** Site-wide configurable parameter definitions (`BUILTIN`, `USER_PROFILE_FIELD`, `COURSE_CUSTOM_FIELD`, `STATIC`) resolved via `{{shortname}}` template placeholders or URL query parameters.
- **Configurable Metadata Types & High-Volume Viewer:** Admin-managed typed metadata definitions (`TEXT`, `BADGE`, `TAGS`, `URL`, `DATE`, `NUMBER`, `DURATION`, `BOOLEAN`, `MULTILINE`) plus normalized per-instance storage and a searchable, chip-filterable Didactika explorer (`dd-dl` cards and compact table view).
- **Rich Presentation Modes:** Click-to-play lazy inline iframe, modal lightbox, customizable popup (`WxH`), card view, and new/same-tab navigation without slowing down course pages.
- **Extensible Completion:** Native Moodle completion (`None`, `Manual`, `View`) plus `smarturlcomp_*` subplugin type and PSR-14 hooks for custom completion providers.
- **Policy Governance & Two-Branch Availability:** Generic external `locked_fields` enforcement and `AND(managed_availability, custom_availability)` tree composition inside native `moodleform_mod`, plus Site Admin restrictions.
- **Selective CLI Migration (`cli/migrate_from_url.php`):** Event-emitting migration of selected `mod_url` modules (`--idnumber-prefix`, `--courseid`, `--cmids`, `--url-pattern`, `--dry-run`) using official Moodle APIs so lifecycle and completion events are preserved.
