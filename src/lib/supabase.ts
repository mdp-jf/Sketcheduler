import { createClient } from '@supabase/supabase-js'

// Option 1: Use process.env if you're using Node.js
// const supabaseUrl = process.env.VITE_SUPABASE_URL as string
// const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY as string

// Option 2: For Vite with proper TypeScript configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)