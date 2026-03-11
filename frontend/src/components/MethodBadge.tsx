const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  GET:    { bg: 'rgba(76, 175, 130, 0.15)', text: '#4caf82' },
  POST:   { bg: 'rgba(94, 106, 210, 0.15)', text: '#5e6ad2' },
  PUT:    { bg: 'rgba(212, 168, 75, 0.15)',  text: '#d4a84b' },
  PATCH:  { bg: 'rgba(212, 168, 75, 0.15)',  text: '#d4a84b' },
  DELETE: { bg: 'rgba(207, 75, 75, 0.15)',   text: '#cf4b4b' },
}

const FALLBACK = { bg: 'rgba(139, 143, 168, 0.15)', text: '#8b8fa8' }

interface Props {
  method: string
}

export default function MethodBadge({ method }: Props) {
  const { bg, text } = METHOD_COLORS[method.toUpperCase()] ?? FALLBACK
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {method.toUpperCase()}
    </span>
  )
}
