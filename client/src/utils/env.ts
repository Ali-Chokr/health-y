type EnvConfig = {
  supabaseUrl: string
  supabaseAnonKey: string
}

function getEnvVar(key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const value = import.meta.env[key]

  // Allow missing vars in test environment
  if (!value && import.meta.env.MODE === 'test') {
    return key === 'VITE_SUPABASE_URL' ? 'https://test.supabase.co' : 'test-key'
  }

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

export const env: EnvConfig = {
  supabaseUrl: getEnvVar('VITE_SUPABASE_URL'),
  supabaseAnonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
}
