import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import styles from './AuthPage.module.css'
import primitives from '@/styles/primitives.module.css'
import layout from '@/components/Layout.module.css'
import typography from '@/styles/typography.module.css'

export default function AuthPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Sign up successful! Check your email to confirm.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={layout.pageCenter}>
      <section className={styles.authPanel}>
        <h1 className={typography.h1}>{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>
        {error && <div className={`${primitives.alert} ${primitives.alertError}`}>{error}</div>}
        <form onSubmit={handleAuth} className={styles.authForm}>
          <div className={primitives.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className={primitives.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-base transition-colors bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-base transition-colors bg-[var(--surface-2)] text-[var(--ink-1)] hover:bg-[#ddd5cc] disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          disabled={isLoading}
        >
          {mode === 'signin' ? 'Need an account?' : 'Have an account?'}
        </button>
      </section>
    </div>
  )
}
