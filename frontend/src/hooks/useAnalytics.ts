import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export type TimeRange = '24h' | '7d' | '30d' | 'all'

export interface AnalyticsSummary {
  totalRequests: number
  responseTime: {
    avgMs: number
    minMs: number
    maxMs: number
  }
  statusCodes: { statusCode: number; count: number }[]
}

export interface EndpointStat {
  endpointId: string
  method: string
  path: string
  requestCount: number
  avgResponseTimeMs: number
}

const RANGE_MS: Record<Exclude<TimeRange, 'all'>, number> = {
  '24h': 86_400_000,
  '7d': 604_800_000,
  '30d': 2_592_000_000,
}

function rangeToParams(range: TimeRange): Record<string, string> {
  if (range === 'all') return {}
  return { from: new Date(Date.now() - RANGE_MS[range]).toISOString() }
}

export function useAnalyticsSummary(projectId: string, range: TimeRange) {
  return useQuery<AnalyticsSummary>({
    queryKey: ['analytics', 'summary', projectId, range],
    queryFn: () =>
      api
        .get(`/projects/${projectId}/analytics/summary`, { params: rangeToParams(range) })
        .then((r) => r.data),
    enabled: !!projectId,
  })
}

export function useAnalyticsEndpoints(projectId: string, range: TimeRange) {
  return useQuery<EndpointStat[]>({
    queryKey: ['analytics', 'endpoints', projectId, range],
    queryFn: () =>
      api
        .get(`/projects/${projectId}/analytics/endpoints`, { params: rangeToParams(range) })
        .then((r) => r.data),
    enabled: !!projectId,
  })
}
