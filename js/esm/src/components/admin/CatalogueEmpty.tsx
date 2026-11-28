/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * The empty state of a catalogue section. After a search or a filter it says nothing matched and offers to clear them; the first
 * time it says what the section holds and offers to create the first item.
 *
 * @module     mod_smarturl/components/admin/CatalogueEmpty
 * @copyright  2026 Didactika.org
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Pix from '../common/Pix';
import type {CatalogueSection} from '../../lib/catalogue';

interface Props {
    section: CatalogueSection;
    filtered: boolean;
    icons: Record<string, string>;
    strings: Record<string, string>;
    onAdd: (opener: HTMLElement) => void;
    onClear: () => void;
}

/**
 * Draws the empty state.
 *
 * @param props The section, whether a search or a filter emptied it, the icons, the texts and the two ways out.
 * @returns The empty state.
 */
const CatalogueEmpty = ({section, filtered, icons, strings: t, onAdd, onClear}: Props) =>
    <div className="d-flex flex-column align-items-center gap-2 px-4 py-5 text-center">
        <span className={'icon-box' + (filtered ? ' text-info' : '')}>
            <Pix html={icons[filtered ? 'a/search' : section.icon]}/>
        </span>
        <p className="h6 fw-bold mb-0">{filtered ? t.emptyresults : section.emptytitle}</p>
        <p className="text-body-secondary mb-0">{filtered ? t.emptyresultstext : section.emptytext}</p>
        {filtered
            ? <button type="button" className="btn btn-outline-secondary mt-2" onClick={onClear}>{t.clearfilters}</button>
            : <button type="button" className="btn btn-primary mt-2" onClick={event => onAdd(event.currentTarget)}>
                <Pix html={icons['t/add']}/> {section.add}
            </button>}
    </div>;

export default CatalogueEmpty;
