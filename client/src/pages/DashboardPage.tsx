import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { usePrescriptions } from '@/hooks/useDatabase'
import { AddPrescriptionForm } from '@/components/AddPrescriptionForm'
import { PrescriptionCard } from '@/components/PrescriptionCard'

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const navigate = useNavigate()
  const { data: prescriptions = [], isLoading: isPrescriptionsLoading, error } = usePrescriptions()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth')
    }
  }, [isLoading, isAuthenticated, navigate])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (isLoading) {
    return <div className="page-center">Loading...</div>
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="dashboard-container">
      <section className="dashboard-header">
        <h1>Welcome, {user.email}</h1>
        <button className="btn btn-secondary" onClick={handleSignOut}>
          Sign out
        </button>
      </section>

      <section className="dashboard-prescriptions">
        <div className="prescriptions-top">
          <h2>Your prescriptions</h2>
          <AddPrescriptionForm />
        </div>

        {isPrescriptionsLoading ? (
          <p>Loading prescriptions...</p>
        ) : error ? (
          <div className="alert alert-error">
            Failed to load prescriptions: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="placeholder">No prescriptions added yet. Start by adding your first prescription.</p>
        ) : (
          <div className="prescriptions-grid">
            {prescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-content">
        <article className="dashboard-card">
          <h2>Adherence summary</h2>
          <p className="placeholder">Track your medication adherence here once you add prescriptions.</p>
        </article>
      </section>
    </div>
  )
}
