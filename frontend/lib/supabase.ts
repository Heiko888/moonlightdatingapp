import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API Base URL for Edge Functions
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-project.supabase.co/functions/v1'

// Helper function to get auth token
export const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// Helper function to make authenticated API calls
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken()
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}
