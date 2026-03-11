import type { EndpointStat } from '../hooks/useAnalytics'
import MethodBadge from './MethodBadge'

interface Props {
  endpoints: EndpointStat[]
}

export default function EndpointUsageTable({ endpoints }: Props) {
  if (endpoints.length === 0) {
    return (
      <p className="text-sm py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
        No endpoint data yet
      </p>
    )
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr
          className="text-xs uppercase tracking-wide"
          style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}
        >
          <th className="pb-2 text-left font-medium">Method</th>
          <th className="pb-2 text-left font-medium">Path</th>
          <th className="pb-2 text-right font-medium">Requests</th>
          <th className="pb-2 text-right font-medium">Avg Response</th>
        </tr>
      </thead>
      <tbody>
        {endpoints.map((e) => (
          <tr
            key={e.endpointId}
            className="border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <td className="py-3 pr-4">
              <MethodBadge method={e.method} />
            </td>
            <td className="py-3 pr-4 font-mono" style={{ color: 'var(--color-text-primary)' }}>
              {e.path}
            </td>
            <td className="py-3 text-right" style={{ color: 'var(--color-text-secondary)' }}>
              {e.requestCount.toLocaleString()}
            </td>
            <td className="py-3 text-right" style={{ color: 'var(--color-text-secondary)' }}>
              {e.avgResponseTimeMs} ms
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
