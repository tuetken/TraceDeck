import { useState, FormEvent } from 'react'
import { useProjects, useCreateProject, useDeleteProject } from '../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'
import Modal from '../components/Modal'
import Breadcrumb from '../components/Breadcrumb'

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()

  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    await createProject.mutateAsync({ name, description })
    setName('')
    setDescription('')
    setShowModal(false)
  }

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <Breadcrumb crumbs={[{ label: 'Projects' }]} />
        <button
          onClick={() => setShowModal(true)}
          className="rounded px-3 py-1.5 text-sm font-medium"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-primary)' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent-hover)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent)'
          }}
        >
          New Project
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Loading…
        </p>
      ) : projects.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          No projects yet. Create one to get started.
        </p>
      ) : (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={(id) => deleteProject.mutate(id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="New Project" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="rounded px-3 py-2 text-sm outline-none focus:ring-1"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Description{' '}
                <span style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded px-3 py-2 text-sm outline-none focus:ring-1 resize-none"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded px-3 py-1.5 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createProject.isPending}
                className="rounded px-3 py-1.5 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-primary)' }}
              >
                {createProject.isPending ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
