import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp, confirmSignUp } from '../lib/auth'

type Mode = 'signin' | 'signup' | 'confirm'

const inputStyle = {
  backgroundColor: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-primary)',
  // @ts-expect-error CSS custom property
  '--tw-ring-color': 'var(--color-accent)',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  // Preserved after sign-up so the confirm step can auto-sign-in
  const [pendingEmail, setPendingEmail] = useState('')
  const [pendingPassword, setPendingPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function switchTo(next: Mode) {
    setError(null)
    setMode(next)
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await signUp(email, password)
      setPendingEmail(email)
      setPendingPassword(password)
      switchTo('confirm')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await confirmSignUp(pendingEmail, code)
      await signIn(pendingEmail, pendingPassword)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Confirmation failed')
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

        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="rounded px-3 py-2 text-sm outline-none focus:ring-1"
                style={inputStyle}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="rounded px-3 py-2 text-sm outline-none focus:ring-1"
                style={inputStyle}
              />
            </Field>
            <ErrorMessage message={error} />
            <SubmitButton loading={loading} label="Sign in" loadingLabel="Signing in…" />
            <Toggle
              prompt="Don't have an account?"
              action="Create one"
              onClick={() => switchTo('signup')}
            />
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="rounded px-3 py-2 text-sm outline-none focus:ring-1"
                style={inputStyle}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded px-3 py-2 text-sm outline-none focus:ring-1"
                style={inputStyle}
              />
            </Field>
            <Field label="Confirm password">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded px-3 py-2 text-sm outline-none focus:ring-1"
                style={inputStyle}
              />
            </Field>
            <ErrorMessage message={error} />
            <SubmitButton loading={loading} label="Create account" loadingLabel="Creating account…" />
            <Toggle
              prompt="Already have an account?"
              action="Sign in"
              onClick={() => switchTo('signin')}
            />
          </form>
        )}

        {mode === 'confirm' && (
          <form onSubmit={handleConfirm} className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              We sent a verification code to <strong style={{ color: 'var(--color-text-primary)' }}>{pendingEmail}</strong>. Enter it below.
            </p>
            <Field label="Verification code">
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoComplete="one-time-code"
                className="rounded px-3 py-2 text-sm outline-none focus:ring-1 tracking-widest"
                style={inputStyle}
              />
            </Field>
            <ErrorMessage message={error} />
            <SubmitButton loading={loading} label="Verify" loadingLabel="Verifying…" />
            <Toggle
              prompt="Wrong account?"
              action="Back to sign in"
              onClick={() => switchTo('signin')}
            />
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
      {message}
    </p>
  )
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 rounded px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
      style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-primary)' }}
      onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-accent-hover)')}
      onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-accent)')}
    >
      {loading ? loadingLabel : label}
    </button>
  )
}

function Toggle({ prompt, action, onClick }: { prompt: string; action: string; onClick: () => void }) {
  return (
    <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
      {prompt}{' '}
      <button
        type="button"
        onClick={onClick}
        className="underline"
        style={{ color: 'var(--color-accent)' }}
      >
        {action}
      </button>
    </p>
  )
}
