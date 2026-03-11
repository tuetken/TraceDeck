import { Link } from 'react-router-dom'
import { Project } from '../hooks/useProjects'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const date = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link
      to={`/projects/${project.id}`}
      className="flex flex-col gap-2 rounded-lg p-4 transition-colors"
      style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {project.name}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault()
            onDelete(project.id)
          }}
          className="text-xs shrink-0 transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-danger)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'
          }}
        >
          Delete
        </button>
      </div>

      {project.description && (
        <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
          {project.description}
        </p>
      )}

      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {date}
      </p>
    </Link>
  )
}
