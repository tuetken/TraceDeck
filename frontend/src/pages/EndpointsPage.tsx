import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import EndpointUsageTable from '../components/EndpointUsageTable'
import { useProjects } from '../hooks/useProjects'
import { useCreateEndpoint } from '../hooks/useEndpoints'
import { useAnalyticsEndpoints } from '../hooks/useAnalytics'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export default function EndpointsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [method, setMethod] = useState('GET')
  const [path, setPath] = useState('')
  const [formError, setFormError] = useState('')

  const { data: projects = [] } = useProjects()
  const project = projects.find((p) => p.id === projectId)

  const { data: endpointStats = [], isLoading } = useAnalyticsEndpoints(projectId!, 'all')
  const createEndpoint = useCreateEndpoint(projectId!)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!path.trim()) {
      setFormError('Path is required')
      return
    }
    setFormError('')
    await createEndpoint.mutateAsync({ method, path: path.trim() })
    setPath('')
    setMethod('GET')
  }

  return (
    <main className="flex-1 p-6" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <div className="mb-6">
        <Breadcrumb
          crumbs={[
            { label: 'Projects', href: '/projects' },
            { label: project?.name ?? '…', href: `/projects/${projectId}` },
            { label: 'Endpoints' },
          ]}
        />
      </div>

      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
      >
        <p className="text-xs font-medium mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Endpoints
        </p>

        {isLoading ? (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
            Loading…
          </p>
        ) : (
          <EndpointUsageTable endpoints={endpointStats} />
        )}

        {/* Add endpoint inline form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-2 py-1.5 rounded text-xs font-mono font-semibold"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/api/resource"
            className="flex-1 px-3 py-1.5 rounded text-sm font-mono"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            disabled={createEndpoint.isPending}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
              opacity: createEndpoint.isPending ? 0.6 : 1,
              cursor: createEndpoint.isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {createEndpoint.isPending ? 'Adding…' : 'Add Endpoint'}
          </button>
        </form>

        {formError && (
          <p className="text-xs mt-2" style={{ color: 'var(--color-danger)' }}>{formError}</p>
        )}
      </div>
    </main>
  )
}
