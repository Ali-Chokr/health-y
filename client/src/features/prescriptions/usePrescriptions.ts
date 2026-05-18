import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Prescription, CreatePrescriptionInput } from '@/types/database'

const PRESCRIPTIONS_KEY = ['prescriptions'] as const

export function usePrescriptions() {
  const { user } = useAuth()

  return useQuery({
    queryKey: PRESCRIPTIONS_KEY,
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
      queryClient.invalidateQueries({ queryKey: PRESCRIPTIONS_KEY })
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
      queryClient.invalidateQueries({ queryKey: PRESCRIPTIONS_KEY })
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
      queryClient.invalidateQueries({ queryKey: PRESCRIPTIONS_KEY })
    },
  })
}
