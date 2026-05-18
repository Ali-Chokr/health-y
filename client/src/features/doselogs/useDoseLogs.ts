import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { DoseLog, CreateDoseLogInput } from '@/types/database'

const DOSELOGS_FOR_PRESCRIPTION_KEY = (prescriptionId: string) => ['doseLogs', prescriptionId] as const
const DOSELOGS_FOR_TODAY_KEY = ['doseLogs', 'today'] as const

export function useDoseLogsForPrescription(prescriptionId: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: DOSELOGS_FOR_PRESCRIPTION_KEY(prescriptionId),
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
      queryClient.invalidateQueries({ queryKey: DOSELOGS_FOR_PRESCRIPTION_KEY(variables.prescription_id) })
      queryClient.invalidateQueries({ queryKey: DOSELOGS_FOR_TODAY_KEY })
    },
  })
}
