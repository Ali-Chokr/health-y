import { useAddPrescriptionForm } from './useAddPrescriptionForm'
import styles from './AddPrescriptionForm.module.css'
import primitives from '@/styles/primitives.module.css'
import typography from '@/styles/typography.module.css'

type AddPrescriptionFormProps = {
  onSuccess?: () => void
}

export function AddPrescriptionForm({ onSuccess }: AddPrescriptionFormProps) {
  const {
    isOpen,
    setIsOpen,
    formData,
    setFormData,
    medications,
    createMutation,
    handleSubmit,
  } = useAddPrescriptionForm(onSuccess)

  if (!isOpen) {
    return (
      <button
        className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-base transition-colors bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={() => setIsOpen(true)}
      >
        Add prescription
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={styles.addPrescriptionForm}>
      <h2 className={typography.h2}>Add prescription</h2>

      <div className={primitives.formGroup}>
        <label htmlFor="medication">Medication</label>
        <select
          id="medication"
          value={formData.medication_id}
          onChange={(e) => {
            const selected = medications.find(m => m.id === e.target.value)
            setFormData({
              ...formData,
              medication_id: e.target.value,
              medication_name: selected?.name || '',
            })
          }}
          required
        >
          <option value="">Select a medication</option>
          {medications.map((med) => (
            <option key={med.id} value={med.id}>
              {med.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formRow}>
        <div className={primitives.formGroup}>
          <label htmlFor="dosage">Dosage</label>
          <input
            id="dosage"
            type="text"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="e.g., 500"
            required
          />
        </div>
        <div className={primitives.formGroup}>
          <label htmlFor="unit">Unit</label>
          <select
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          >
            <option value="mg">mg</option>
            <option value="g">g</option>
            <option value="mcg">mcg</option>
            <option value="IU">IU</option>
            <option value="ml">ml</option>
            <option value="tablet">tablet</option>
            <option value="capsule">capsule</option>
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={primitives.formGroup}>
          <label htmlFor="frequency">Frequency</label>
          <input
            id="frequency"
            type="text"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            placeholder="e.g., Once daily"
            required
          />
        </div>
        <div className={primitives.formGroup}>
          <label htmlFor="frequency_per_day">Times per day</label>
          <input
            id="frequency_per_day"
            type="number"
            min="1"
            value={formData.frequency_per_day}
            onChange={(e) => setFormData({ ...formData, frequency_per_day: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={primitives.formGroup}>
          <label htmlFor="start_date">Start date</label>
          <input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>
        <div className={primitives.formGroup}>
          <label htmlFor="end_date">End date (optional)</label>
          <input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
      </div>

      <div className={primitives.formGroup}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g., Take with food"
          rows={3}
        />
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-base transition-colors bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Adding...' : 'Add prescription'}
        </button>
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 rounded-lg font-medium text-base transition-colors bg-[var(--surface-2)] text-[var(--ink-1)] hover:bg-[#ddd5cc] disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => setIsOpen(false)}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>
      </div>

      {createMutation.isError && (
        <div className={`${primitives.alert} ${primitives.alertError}`}>
          {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to add prescription'}
        </div>
      )}
    </form>
  )
}
