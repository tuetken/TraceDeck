import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../lib/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-full max-w-sm rounded-lg p-8"
        style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
      >
        <h1 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          TraceDeck
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded px-3 py-2 text-sm outline-none focus:ring-1"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                // @ts-expect-error CSS custom property
                '--tw-ring-color': 'var(--color-accent)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rounded px-3 py-2 text-sm outline-none focus:ring-1"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                // @ts-expect-error CSS custom property
                '--tw-ring-color': 'var(--color-accent)',
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-text-primary)',
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-accent-hover)')
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-accent)')
            }
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
