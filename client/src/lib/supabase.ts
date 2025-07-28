import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xwbapwyslonhxxwynean.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3YmFwd3lzbG9uaHh4d3luZWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzk0NDEsImV4cCI6MjA2OTAxNTQ0MX0.rupOaPIk9LSSzCgnBfz7l9ZfsQCIbZ8CxoCSVk-Enus';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('teachers').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}

export default supabase;