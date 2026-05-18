import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import styles from './HomePage.module.css'
import typography from '@/styles/typography.module.css'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return <div className={styles.pageCenter}>Loading...</div>
  }

  return (
    <div className={styles.pageCenter}>
      <section className={styles.heroPanel}>
        <p className={styles.eyebrow}>Health-y platform</p>
        <h1 className={typography.h1}>Welcome to your medication companion</h1>
        <p className={styles.lead}>
          Track your prescriptions, stay on schedule, and take control of your health.
        </p>
        <a
          href="/auth"
          className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-base transition-colors bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
        >
          Get started
        </a>
      </section>
    </div>
  )
}
