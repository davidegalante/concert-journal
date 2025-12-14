import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase
// Using the credentials provided by the user
const supabaseUrl = process.env.SUPABASE_URL || 'https://mcclmbmtbsjusbkwslwv.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jY2xtYm10YnNqdXNia3dzbHd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MjA4NjEsImV4cCI6MjA4MTI5Njg2MX0.hkobygq_lxq1uIrPcyiWnIGo0X_Za6K481HxG5TpT9w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);