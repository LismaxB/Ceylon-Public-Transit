import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase URL and Anon Key from your Supabase dashboard
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);