import { Database } from '@/lib/database.types'
import { SupabaseClient } from '@supabase/supabase-js'

export type AppSupabaseClient = SupabaseClient<Database>

export type Table<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']