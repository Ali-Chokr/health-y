import { Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Layout() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">Health-y</h1>
          <nav className="header-nav">
            {isAuthenticated ? (
              <span className="auth-status">Authenticated</span>
            ) : (
              <span className="auth-status">Not signed in</span>
            )}
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
