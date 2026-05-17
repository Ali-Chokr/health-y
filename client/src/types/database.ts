export type Profile = {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export type Medication = {
  id: string
  name: string
  description: string | null
  common_uses: string[] | null
  side_effects: string[] | null
  interactions: string[] | null
  created_at: string
  updated_at: string
}

export type Prescription = {
  id: string
  user_id: string
  medication_id: string
  medication_name: string
  dosage: string
  unit: string
  frequency: string
  frequency_per_day: number
  start_date: string
  end_date: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type DoseLog = {
  id: string
  user_id: string
  prescription_id: string
  logged_at: string
  taken_at: string | null
  status: 'taken' | 'missed' | 'skipped'
  notes: string | null
  created_at: string
}

export type CreatePrescriptionInput = {
  medication_id: string
  medication_name: string
  dosage: string
  unit?: string
  frequency: string
  frequency_per_day: number
  start_date: string
  end_date?: string
  notes?: string
}

export type CreateDoseLogInput = {
  prescription_id: string
  logged_at: string
  taken_at?: string
  status: 'taken' | 'missed' | 'skipped'
  notes?: string
}
