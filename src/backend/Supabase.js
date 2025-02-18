import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabaseUrl = 'https://ikvmctpberzquhmcqofh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlrdm1jdHBiZXJ6cXVobWNxb2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwODY1OTAsImV4cCI6MjA1MjY2MjU5MH0.chRs2yZHgRDQs6vLbFcX9M_oUKplAXwE9eWpxsh1hzU'

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase configuration missing!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
