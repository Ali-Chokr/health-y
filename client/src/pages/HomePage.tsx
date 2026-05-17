import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return <div className="page-center">Loading...</div>
  }

  return (
    <div className="page-center">
      <section className="hero-panel">
        <p className="eyebrow">Health-y platform</p>
        <h1>Welcome to your medication companion</h1>
        <p className="lead">
          Track your prescriptions, stay on schedule, and take control of your health.
        </p>
        <a href="/auth" className="btn btn-primary">
          Get started
        </a>
      </section>
    </div>
  )
}
