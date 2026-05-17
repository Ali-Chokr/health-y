import type { Prescription } from '@/types/database'
import { useDoseLogsForPrescription, useCreateDoseLog } from '@/hooks/useDatabase'
import { useState } from 'react'

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
  const todayDoseLog = doseLogs.find(
    (log) => log.logged_at.split('T')[0] === today,
  )

  return (
    <article className="prescription-card">
      <div className="prescription-header">
        <div>
          <h3>{prescription.medication_name}</h3>
          <p className="prescription-dosage">
            {prescription.dosage} {prescription.unit}
          </p>
        </div>
        <div className="prescription-status">
          {todayDoseLog ? (
            <span className={`status-badge status-${todayDoseLog.status}`}>
              {todayDoseLog.status === 'taken' ? '✓ Taken today' : 'Missed'}
            </span>
          ) : (
            <span className="status-badge status-pending">Not logged today</span>
          )}
        </div>
      </div>

      <div className="prescription-details">
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
          className="btn btn-primary btn-small"
          onClick={handleLogDose}
          disabled={createDoseLogMutation.isPending}
        >
          {createDoseLogMutation.isPending ? 'Logging...' : 'Log dose taken'}
        </button>
      )}

      {prescription.notes && (
        <div className="prescription-notes">
          <button
            className="btn-text"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? 'Hide' : 'Show'} notes
          </button>
          {showNotes && (
            <p className="notes-text">{prescription.notes}</p>
          )}
        </div>
      )}

      {doseLogs.length > 0 && doseLogs[0] && (
        <div className="dose-history">
          <p className="text-small">
            Last logged: {new Date(doseLogs[0].logged_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {createDoseLogMutation.isError && (
        <div className="alert alert-error alert-small">
          {createDoseLogMutation.error instanceof Error
            ? createDoseLogMutation.error.message
            : 'Failed to log dose'}
        </div>
      )}
    </article>
  )
}
