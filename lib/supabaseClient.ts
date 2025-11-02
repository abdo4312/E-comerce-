import { createClient, SupabaseClient } from '@supabase/supabase-js';

// User-provided Supabase credentials
const supabaseUrl = 'https://givxxytthfpnyiulcvdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpdnh4eXR0aGZwbnlpdWxjdmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTUwODMsImV4cCI6MjA3NzUzMTA4M30.n5TVhHg1kWBlZtkrBu_lAmF1RdIl983_N301QD4RcTA';

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
  }
} else {
  console.warn("Supabase credentials are not set correctly.");
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = !!supabaseInstance;