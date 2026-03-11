import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUserEmail, signOut } from '../lib/auth'
import { useProjects } from '../hooks/useProjects'

type MenuItem = { label: string; onClick: () => void }

function AccountMenu() {
  const navigate = useNavigate()
  const email = getCurrentUserEmail()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const menuItems: MenuItem[] = [
    {
      label: 'Sign out',
      onClick: () => {
        signOut()
        navigate('/login')
      },
    },
  ]

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-1.5 w-full text-left text-sm font-medium truncate"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <span className="truncate">{email ?? 'Account'}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
          className="shrink-0 opacity-60"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 w-48 rounded z-50 py-1"
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { setIsOpen(false); item.onClick() }}
              className="w-full text-left px-3 py-2 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const { data: projects = [] } = useProjects()

  return (
    <aside
      className="w-56 shrink-0 flex flex-col h-screen sticky top-0"
      style={{ backgroundColor: 'var(--color-bg-surface)', borderRight: '1px solid var(--color-border)' }}
    >
      <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <AccountMenu />
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
