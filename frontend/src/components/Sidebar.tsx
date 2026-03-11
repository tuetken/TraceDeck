import { NavLink } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'

export default function Sidebar() {
  const { data: projects = [] } = useProjects()

  return (
    <aside
      className="w-56 shrink-0 flex flex-col h-screen sticky top-0"
      style={{ backgroundColor: 'var(--color-bg-surface)', borderRight: '1px solid var(--color-border)' }}
    >
      <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
          TraceDeck
        </span>
      </div>

      <nav className="flex flex-col gap-0.5 p-2 overflow-y-auto flex-1">
        <p
          className="px-2 py-1 text-xs uppercase tracking-wider mb-1"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Projects
        </p>
        {projects.map((project) => (
          <NavLink
            key={project.id}
            to={`/projects/${project.id}`}
            className="rounded px-2 py-1.5 text-sm truncate"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              backgroundColor: isActive ? 'var(--color-bg-elevated)' : 'transparent',
            })}
          >
            {project.name}
          </NavLink>
        ))}
        {projects.length === 0 && (
          <p className="px-2 py-1.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No projects yet
          </p>
        )}
      </nav>
    </aside>
  )
}
