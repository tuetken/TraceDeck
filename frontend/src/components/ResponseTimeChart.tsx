import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { EndpointStat } from '../hooks/useAnalytics'

interface Props {
  endpoints: EndpointStat[]
}

// Truncate long method+path labels so the chart stays readable
function formatLabel(method: string, path: string): string {
  const full = `${method} ${path}`
  return full.length > 22 ? full.slice(0, 20) + '…' : full
}

export default function ResponseTimeChart({ endpoints }: Props) {
  const data = endpoints.map((e) => ({
    label: formatLabel(e.method, e.path),
    avgMs: e.avgResponseTimeMs,
  }))

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
    >
      <p className="text-xs font-medium mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        Avg Response Time (ms)
      </p>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          No data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 0, right: 8, bottom: 32, left: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: '#8b8fa8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fill: '#8b8fa8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                backgroundColor: '#1e2028',
                border: '1px solid #2a2d35',
                borderRadius: 6,
                color: '#e8eaed',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value} ms`, 'Avg']}
            />
            <Bar dataKey="avgMs" radius={[3, 3, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill="#5e6ad2" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
