/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * @module     mod_smarturl/hooks/useDebouncedValue
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import {useEffect, useState} from 'react';

export const useDebouncedValue = <T, >(value: T, delayMs: number): T => {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const handle = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(handle);
    }, [value, delayMs]);

    return debounced;
};
