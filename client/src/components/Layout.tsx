import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import styles from './Layout.module.css'

export default function Layout() {
  const { isAuthenticated } = useAuth()

  return (
    <div className={styles.appLayout}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.brand} aria-label="Health-y home">
            <img className={styles.brandLogo} src="/health-y-logo.png" alt="Health-y logo" />
            <span className={styles.brandText}>Health-y</span>
          </Link>
          <nav className={styles.headerNav}>
            {isAuthenticated ? (
              <span className={styles.authStatus}>Authenticated</span>
            ) : (
              <span className={styles.authStatus}>Not signed in</span>
            )}
          </nav>
        </div>
      </header>
      <main className={styles.appMain}>
        <Outlet />
      </main>
    </div>
  )
}
