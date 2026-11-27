# Smart URL

Smart URL is a Moodle activity for websites, documents, images, audio, video, and other resources identified by a URL.

- Choose a link, card, or cover image for the course page.
- Open the activity, show a course preview, use a compact Moodle viewer in another tab or window, or visit the external site.
- Show a cover or embed a supported resource, followed by its description and selected metadata.
- Build links from site-managed variables and save translated titles and descriptions.
- Manage categories, metadata fields, variables, and defaults from site administration. Disable definitions to retain their values.
- Preview a draft before saving. The preview uses sample values for link variables.
- Integrate through Moodle web services and installed completion, player, and metadata-type subplugins.

## Administration

Open **Site administration → Plugins → Activity modules → Smart URL** for display defaults, popup dimensions, and file type icons. Follow **Smart URL configuration** to manage the catalogue.

Editing permissions use the standard Moodle capabilities. An integration with `mod/smarturl:manageexternal` can set locks on externally managed activities. A user with `mod/smarturl:bypasspolicy` can edit those fields. Moodle site administrators use their normal administrative access.

## Resource display

The viewer supports images, PDF, audio, video, and frame-compatible web pages. YouTube links are converted to a privacy-enhanced embed URL. Vimeo and other recognised media can use an installed Moodle media player. A resource that cannot be embedded can always be opened at its destination.

## Extensions

The component declares these Moodle subplugin types:

| Type | Installation path relative to `mod/smarturl` | Contract |
| --- | --- | --- |
| `smarturlcomp` | `completion/rule/<name>` | `completion\rule_provider` |
| `smarturlplayer` | `media/player/<name>` | `local\url\player` |
| `smarturlmeta` | `metadata/type/<name>` | `local\metadata\field_type` |
| `smarturlsource` | `catalogue/source/<name>` | `local\catalogue\source` |

An extension should declare a dependency on `mod_smarturl` and test its supported Moodle versions. Site configuration defines the meaning and visibility of metadata fields. A metadata extension supplies an additional field type.

## Integration

`mod_smarturl_get_editor_context` returns the effective editor catalogue in one request. `mod_smarturl_save_instances` accepts complete resources, with an independent result for each item. Existing creation, update, reading, and metadata operations remain available. Create and update accept presentation and translation data. Instance reads accept an optional lightweight metadata projection.

The module uses the [Didactika Moodle Design System](https://moodle-design.didactika.org/).

## Moodle compatibility

This distribution uses the Moodle 4.5-compatible Mustache and AMD interface. Check the release metadata for its declared Moodle range.

### Extensions

Open **Site administration → Plugins → Activity modules → Smart URL extensions** to enable or disable installed extensions and open their configuration pages. Smart URL recognises player, metadata type, catalogue source and completion rule extensions.

- [YouTube player](https://github.com/didactika/moodle-smarturlplayer_youtube)
- [ISBN metadata type](https://github.com/didactika/moodle-smarturlmeta_identifier)
- [Course link catalogue](https://github.com/didactika/moodle-smarturlsource_courseurls)

Choose the extension distribution for the installed Moodle line. Install each one inside its corresponding Smart URL subplugin directory.

### Loading on request

**Load on click** delays resolving the resource in the browser until the learner opens it. Moodle checks access and then hands the request to the source. The destination is visible to the browser after activation.
