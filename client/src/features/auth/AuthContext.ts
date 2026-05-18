import { createContext } from 'react'
import type { User, Session } from '@supabase/supabase-js'

export type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
