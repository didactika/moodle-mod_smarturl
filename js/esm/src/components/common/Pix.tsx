/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * A Moodle icon the page rendered with the pix helper, so the theme draws it as it draws its own.
 *
 * @module     mod_smarturl/components/common/Pix
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Draws a Moodle icon.
 *
 * @param props The markup Moodle rendered for the icon.
 * @returns The icon.
 */
const Pix = ({html}: {html?: string}) => <span dangerouslySetInnerHTML={{__html: html ?? ''}}/>;

export default Pix;
