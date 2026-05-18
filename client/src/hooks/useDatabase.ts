// Central re-export surface for feature hooks and shared query keys

// Query keys for React Query
export const queryKeys = {
  medications: ['medications'],
  prescriptions: ['prescriptions'],
  prescriptionById: (id: string) => ['prescriptions', id],
  doseLogs: ['doseLogs'],
  doseLogsForPrescription: (prescriptionId: string) => ['doseLogs', prescriptionId],
  doseLogsForToday: ['doseLogs', 'today'],
}

// ============
// Medications (moved to feature folder)
// ============

export { useMedications } from '@/features/medications/useMedications'

// ============
// Prescriptions
// ============

// ============
// Prescriptions (moved to feature folder)
// ============

export {
  usePrescriptions,
  useCreatePrescription,
  useUpdatePrescription,
  useDeletePrescription,
} from '@/features/prescriptions/usePrescriptions'

// ============
// Dose Logs
// ============
export { useDoseLogsForPrescription, useCreateDoseLog } from '@/features/doselogs/useDoseLogs'
