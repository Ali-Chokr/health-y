import { useState } from 'react'
import { useCreatePrescription, useMedications } from '@/hooks/useDatabase'
import type { CreatePrescriptionInput } from '@/types/database'

type AddPrescriptionFormProps = {
  onSuccess?: () => void
}

export function AddPrescriptionForm({ onSuccess }: AddPrescriptionFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    medication_id: '',
    medication_name: '',
    dosage: '',
    unit: 'mg',
    frequency: '',
    frequency_per_day: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    notes: '',
  })

  const createMutation = useCreatePrescription()
  const { data: medications = [] } = useMedications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.medication_id || !formData.dosage || !formData.frequency || !formData.start_date) {
      return
    }

    const input: CreatePrescriptionInput = {
      medication_id: formData.medication_id,
      medication_name: formData.medication_name || medications.find(m => m.id === formData.medication_id)?.name || '',
      dosage: formData.dosage,
      unit: formData.unit,
      frequency: formData.frequency,
      frequency_per_day: formData.frequency_per_day,
      start_date: formData.start_date as string,
      end_date: formData.end_date || undefined,
      notes: formData.notes || undefined,
    }

    await createMutation.mutateAsync(input)
    setIsOpen(false)
    setFormData({
      medication_id: '',
      medication_name: '',
      dosage: '',
      unit: 'mg',
      frequency: '',
      frequency_per_day: 1,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      notes: '',
    })
    onSuccess?.()
  }

  if (!isOpen) {
    return (
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Add prescription
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="add-prescription-form">
      <h2>Add prescription</h2>

      <div className="form-group">
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

      <div className="form-row">
        <div className="form-group">
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
        <div className="form-group">
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

      <div className="form-row">
        <div className="form-group">
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
        <div className="form-group">
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="start_date">Start date</label>
          <input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end_date">End date (optional)</label>
          <input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g., Take with food"
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Adding...' : 'Add prescription'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIsOpen(false)}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>
      </div>

      {createMutation.isError && (
        <div className="alert alert-error">
          {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to add prescription'}
        </div>
      )}
    </form>
  )
}
