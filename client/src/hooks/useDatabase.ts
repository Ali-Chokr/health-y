import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Prescription, DoseLog, Medication, CreatePrescriptionInput, CreateDoseLogInput } from '@/types/database'

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
// Medications
// ============

export function useMedications() {
  return useQuery({
    queryKey: queryKeys.medications,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('name')

      if (error) throw error
      return data as Medication[]
    },
  })
}

// ============
// Prescriptions
// ============

export function usePrescriptions() {
  const { user } = useAuth()

  return useQuery({
    queryKey: queryKeys.prescriptions,
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Prescription[]
    },
    enabled: !!user,
  })
}

export function useCreatePrescription() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreatePrescriptionInput) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('prescriptions')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as Prescription
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions })
    },
  })
}

export function useUpdatePrescription() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Prescription> & { id: string }) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('prescriptions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as Prescription
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions })
    },
  })
}

export function useDeletePrescription() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('prescriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prescriptions })
    },
  })
}

// ============
// Dose Logs
// ============

export function useDoseLogsForPrescription(prescriptionId: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: queryKeys.doseLogsForPrescription(prescriptionId),
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('dose_logs')
        .select('*')
        .eq('prescription_id', prescriptionId)
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })

      if (error) throw error
      return data as DoseLog[]
    },
    enabled: !!user && !!prescriptionId,
  })
}

export function useCreateDoseLog() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateDoseLogInput) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('dose_logs')
        .insert({
          ...input,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as DoseLog
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.doseLogsForPrescription(variables.prescription_id),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.doseLogsForToday })
    },
  })
}
