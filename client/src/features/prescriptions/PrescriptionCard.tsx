import type { Prescription } from '@/types/database'
import { useDoseLogsForPrescription, useCreateDoseLog } from '@/hooks/useDatabase'
import { useState } from 'react'
import styles from './PrescriptionCard.module.css'
import typography from '@/styles/typography.module.css'
import primitives from '@/styles/primitives.module.css'

type PrescriptionCardProps = {
  prescription: Prescription
}

export function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  const { data: doseLogs = [] } = useDoseLogsForPrescription(prescription.id)
  const createDoseLogMutation = useCreateDoseLog()
  const [showNotes, setShowNotes] = useState(false)

  const handleLogDose = async () => {
    await createDoseLogMutation.mutateAsync({
      prescription_id: prescription.id,
      logged_at: new Date().toISOString(),
      taken_at: new Date().toISOString(),
      status: 'taken',
    })
  }

  // Get today's dose log if any
  const today = new Date().toISOString().split('T')[0]
  const todayDoseLog = doseLogs.find((log) => log.logged_at.split('T')[0] === today)

  return (
    <article className={styles.prescriptionCard}>
      <div className={styles.prescriptionHeader}>
        <div>
          <h3 className={typography.h3}>{prescription.medication_name}</h3>
          <p className={styles.prescriptionDosage}>
            {prescription.dosage} {prescription.unit}
          </p>
        </div>
        <div className={styles.prescriptionStatus}>
          {todayDoseLog ? (
            <span
              className={`${styles.statusBadge} ${
                todayDoseLog.status === 'taken'
                  ? styles.statusTaken
                  : todayDoseLog.status === 'missed'
                    ? styles.statusMissed
                    : styles.statusPending
              }`}
            >
              {todayDoseLog.status === 'taken' ? '✓ Taken today' : 'Missed'}
            </span>
          ) : (
            <span className={`${styles.statusBadge} ${styles.statusPending}`}>Not logged today</span>
          )}
        </div>
      </div>

      <div className={styles.prescriptionDetails}>
        <p>
          <strong>Frequency:</strong> {prescription.frequency}
        </p>
        <p>
          <strong>Started:</strong> {new Date(prescription.start_date).toLocaleDateString()}
        </p>
        {prescription.end_date && (
          <p>
            <strong>Ends:</strong> {new Date(prescription.end_date).toLocaleDateString()}
          </p>
        )}
      </div>

      {!todayDoseLog && (
        <button
          className={`${styles.btnSmall} inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:opacity-60 disabled:cursor-not-allowed`}
          onClick={handleLogDose}
          disabled={createDoseLogMutation.isPending}
        >
          {createDoseLogMutation.isPending ? 'Logging...' : 'Log dose taken'}
        </button>
      )}

      {prescription.notes && (
        <div className={styles.prescriptionNotes}>
          <button className={styles.btnText} onClick={() => setShowNotes(!showNotes)}>
            {showNotes ? 'Hide' : 'Show'} notes
          </button>
          {showNotes && <p className={styles.notesText}>{prescription.notes}</p>}
        </div>
      )}

      {doseLogs.length > 0 && doseLogs[0] && (
        <div className={styles.doseHistory}>
          <p className={styles.textSmall}>Last logged: {new Date(doseLogs[0].logged_at).toLocaleDateString()}</p>
        </div>
      )}

      {createDoseLogMutation.isError && (
        <div className={`${primitives.alert} ${primitives.alertError} ${styles.alertSmall}`}>
          {createDoseLogMutation.error instanceof Error
            ? createDoseLogMutation.error.message
            : 'Failed to log dose'}
        </div>
      )}
    </article>
  )
}
