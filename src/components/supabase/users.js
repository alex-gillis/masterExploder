import { supabase } from './Supabase.js';

export async function registerUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password 
        });

        console.log('Supabase response:', data); // Debug the response
        if (error) throw error;

        return data.user;
    } catch (err) {
        console.error('Registration failed:', err.message);
        return null;
    }
}


export async function loginUser(email, password) {
    try {
        console.log('Logging in with:', { email, password });

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log('Supabase response:', data); // Debug response

        if (error) {
            console.error('Login failed:', error.message);
            throw error; // Re-throw for external error handling
        }

        if (!data.session) {
            console.warn('Session not created. Check email confirmation or settings.');
        }

        return data.user;
    } catch (err) {
        console.error('Login failed:', err.message);
        return null;
    }
}

export async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        console.log('User logged out successfully');
    } catch (err) {
        console.error('Logout failed:', err.message);
    }
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching current user:', error.message);
        return null;
    }

    console.log('Current user:', user);
    return user;
}
