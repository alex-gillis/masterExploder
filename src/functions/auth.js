import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function loginWithAuth0() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'auth0',
    options: { redirectTo: window.location.origin }
  });
  if (error) {
    console.error('Auth0 login failed:', error);
    return null;
  }
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Logout failed:', error);
  window.location.href = '/';
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    // console.error('Failed to get user:', error);
    return null;
  }
  return data.user;
}
