import { useState, type FormEvent } from 'react'
import { useCreatePrescription } from './usePrescriptions'
import { useMedications } from '@/features/medications/useMedications'
import type { CreatePrescriptionInput } from '@/types/database'

export function useAddPrescriptionForm(onSuccess?: () => void) {
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

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()

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

  return {
    isOpen,
    setIsOpen,
    formData,
    setFormData,
    medications,
    createMutation,
    handleSubmit,
  }
}
