import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  href?: string
}

interface BreadcrumbProps {
  crumbs: Crumb[]
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <span style={{ color: 'var(--color-text-muted)' }}>›</span>
          )}
          {crumb.href ? (
            <Link
              to={crumb.href}
              className="hover:underline"
              style={{ color: i === crumbs.length - 1 ? 'var(--color-text-primary)' : undefined }}
            >
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: i === crumbs.length - 1 ? 'var(--color-text-primary)' : undefined }}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
