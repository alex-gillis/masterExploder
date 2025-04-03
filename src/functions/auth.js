import { createClient } from '@supabase/supabase-js';
import { registerUser } from '../backend/Users/Register';
import { loginUser } from '../backend/Users/Login';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function loginWithGooglePopup() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google', // or 'auth0' if you configured Auth0 to provide Google login
    options: { redirectTo: window.location.origin }
  });
  if (error) {
    console.error('Error obtaining OAuth URL:', error);
    return null;
  }
  console.log("This is the data from login:", data)
  // data.url contains the OAuth URL
  // const popup = window.open(data.url, 'OAuthPopup', 'width=500,height=600');
  // return popup;
}

export async function loginWithAuth0() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'auth0',
    options: { redirectTo: window.location.origin }
  });
  if (error) {
    console.error('Auth0 login failed:', error);
    return null;
  }
  console.log("This is the data from login:" + data)
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Logout failed:', error);
  window.location.href = '/';
}

export async function isEmailRegistered(email) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // 'PGRST116' = No rows found
    console.error('Error checking email:', error);
    return false;
  }

  return !!data; // Returns true if user exists, false otherwise
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Failed to get user:', error);
    return null;
  }
  return data.user;
}

export async function fetchOAuthUserDetails() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error('Failed to fetch OAuth user:', error);
    return null;
  }

  // console.log(user);
  return user;
}

export async function checkOAuthUser() {
  const user = await fetchOAuthUserDetails();

  if (isEmailRegistered(user.email) === true) {
    console.log ("User Already Exists");
    return false;
  } else {
    console.log ("User Doesn't Exist");
    return true;
  }
}

export async function registerOAuthUser() {
  const user = await fetchOAuthUserDetails();

  if (!user) {
    console.warn ("User failed to register");
    return null;
  }

  const username = user.user_metadata.given_name || user.user_metadata.name;
  const email = user.email;

  // Instead of a password, store the OAuth provider's user ID to identify the user uniquely
  const oauthProviderId = user.id;

  registerUser(username, email, oauthProviderId);
  console.log('OAuth User registered');

  return;
}

export async function loginOAuthUser() {
  const user = await fetchOAuthUserDetails();

  if (!user) {
    console.warn ("User failed to login");
    return null;
  }

  const email = user.email;

  // Instead of a password, store the OAuth provider's user ID to identify the user uniquely
  const oauthProviderId = user.id;

  const myUser = await loginUser(email, oauthProviderId);
  
  if (myUser) {
    localStorage.setItem('userId', myUser.id);
    localStorage.setItem('username', myUser.username);
    localStorage.setItem('highscore', myUser.highscore);
    // window.location.reload();
    // showMenu('menu');
  }
  console.log('OAuth User logged in');

  return;
}