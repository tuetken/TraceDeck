import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import StatCard from '../components/StatCard'
import TimeRangeSelector from '../components/TimeRangeSelector'
import { useProjects } from '../hooks/useProjects'
import { useAnalyticsSummary, useAnalyticsEndpoints } from '../hooks/useAnalytics'
import type { TimeRange } from '../hooks/useAnalytics'

export default function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [range, setRange] = useState<TimeRange>('24h')

  const { data: projects = [] } = useProjects()
  const project = projects.find((p) => p.id === projectId)

  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary(projectId!, range)
  const { data: endpoints = [] } = useAnalyticsEndpoints(projectId!, range)

  const errorCount = summary?.statusCodes
    .filter((s) => s.statusCode >= 400)
    .reduce((sum, s) => sum + s.count, 0) ?? 0

  return (
    <main className="flex-1 p-6" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb
          crumbs={[
            { label: 'Projects', href: '/projects' },
            { label: project?.name ?? '…' },
          ]}
        />
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      {summaryLoading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Loading…
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
            <StatCard
              label="Total Requests"
              value={summary?.totalRequests.toLocaleString() ?? '—'}
            />
            <StatCard
              label="Avg Response Time"
              value={summary ? `${summary.responseTime.avgMs} ms` : '—'}
            />
            <StatCard
              label="Error Rate"
              value={
                summary && summary.totalRequests > 0
                  ? `${((errorCount / summary.totalRequests) * 100).toFixed(1)}%`
                  : '—'
              }
              sub={`${errorCount} errors`}
            />
            <StatCard
              label="Endpoints Tracked"
              value={endpoints.length}
            />
          </div>

          {/* Chart placeholders — wired in Phase 3.5 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              className="rounded-lg p-4 flex items-center justify-center h-48 text-sm"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              Response Time Chart — Phase 3.5
            </div>
            <div
              className="rounded-lg p-4 flex items-center justify-center h-48 text-sm"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              Status Code Chart — Phase 3.5
            </div>
          </div>
        </>
      )}
    </main>
  )
}
