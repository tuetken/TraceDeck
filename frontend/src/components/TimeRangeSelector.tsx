import type { TimeRange } from '../hooks/useAnalytics'

const RANGES: { label: string; value: TimeRange }[] = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: 'All', value: 'all' },
]

interface TimeRangeSelectorProps {
  value: TimeRange
  onChange: (range: TimeRange) => void
}

export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div
      className="flex rounded overflow-hidden"
      style={{ border: '1px solid var(--color-border)' }}
    >
      {RANGES.map((r, i) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className="px-3 py-1 text-sm"
          style={{
            backgroundColor:
              value === r.value ? 'var(--color-bg-elevated)' : 'transparent',
            color:
              value === r.value
                ? 'var(--color-text-primary)'
                : 'var(--color-text-secondary)',
            borderRight:
              i < RANGES.length - 1 ? '1px solid var(--color-border)' : undefined,
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}
