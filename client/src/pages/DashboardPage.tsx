import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { usePrescriptions } from '@/hooks/useDatabase'
import { AddPrescriptionForm } from '@/features/prescriptions/AddPrescriptionForm'
import { PrescriptionCard } from '@/features/prescriptions/PrescriptionCard'
import styles from './DashboardPage.module.css'
import layout from '@/components/Layout.module.css'
import primitives from '@/styles/primitives.module.css'
import typography from '@/styles/typography.module.css'

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
    return <div className={layout.pageCenter}>Loading...</div>
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.dashboardHeader}>
        <h1 className={typography.h1}>Welcome, {user.email}</h1>
        <button
          className="inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors bg-[var(--surface-2)] text-[var(--ink-1)] hover:bg-[#ddd5cc]"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </section>

      <section className={styles.dashboardPrescriptions}>
        <div className={styles.prescriptionsTop}>
          <h2 className={typography.h2}>Your prescriptions</h2>
          <AddPrescriptionForm />
        </div>

        {isPrescriptionsLoading ? (
          <p>Loading prescriptions...</p>
        ) : error ? (
          <div className={`${primitives.alert} ${primitives.alertError}`}>
            Failed to load prescriptions: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : prescriptions.length === 0 ? (
          <p className={styles.placeholder}>No prescriptions added yet. Start by adding your first prescription.</p>
        ) : (
          <div className={styles.prescriptionsGrid}>
            {prescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
        )}
      </section>

      <section className={styles.dashboardContent}>
        <article className={styles.dashboardCard}>
          <h2 className={typography.h2}>Adherence summary</h2>
          <p className={styles.placeholder}>Track your medication adherence here once you add prescriptions.</p>
        </article>
      </section>
    </div>
  )
}
