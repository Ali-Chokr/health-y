import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import type { Medication } from '@/types/database'

export function useMedications() {
  return useQuery({
    queryKey: ['medications'],
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
