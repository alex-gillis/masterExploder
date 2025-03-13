import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function loginWithAuth0() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'auth0',
        options: {
            redirectTo: window.location.origin
        }
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
        console.error('Failed to get user:', error);
        return null;
    }
    return data.user;
}