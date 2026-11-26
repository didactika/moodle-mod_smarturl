/**
 * This file is part of Moodle - https://moodle.org/
 * Moodle is free software under the GNU General Public License, version 3 or later.
 *
 * Didactika page header component (dd-page-header).
 *
 * @module     mod_smarturl/components/common/PageHeader
 * @copyright  2026 Didactika.org
 * @author     Hector Arrechea <hectorlazaroarrechea@gmail.com>
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import type {ReactNode} from 'react';

interface PageHeaderProps {
    breadcrumb?: Array<{label: string; href?: string}>;
    title: string;
    subtitle?: ReactNode;
    iconLabel?: string;
    actions?: ReactNode;
}

const PageHeader = ({breadcrumb, title, subtitle, iconLabel = 'URL', actions}: PageHeaderProps) => (
    <header className="dd-page-header">
        {breadcrumb && breadcrumb.length > 0 && (
            <nav aria-label="Breadcrumb">
                <ol className="breadcrumb mb-0">
                    {breadcrumb.map((item, idx) => (
                        <li
                            key={`${item.label}-${idx}`}
                            className={`breadcrumb-item${idx === breadcrumb.length - 1 ? ' active' : ''}`}
                            aria-current={idx === breadcrumb.length - 1 ? 'page' : undefined}
                        >
                            {item.href ? <a href={item.href}>{item.label}</a> : item.label}
                        </li>
                    ))}
                </ol>
            </nav>
        )}
        <div className="dd-page-header-row">
            <div className="dd-page-header-main">
                {iconLabel && <span className="dd-tile dd-tile-lg" aria-hidden="true">{iconLabel}</span>}
                <div>
                    <h1 className="dd-page-title">{title}</h1>
                    {subtitle && <div className="dd-page-subtitle">{subtitle}</div>}
                </div>
            </div>
            {actions && <div className="dd-page-actions">{actions}</div>}
        </div>
    </header>
);

export default PageHeader;
