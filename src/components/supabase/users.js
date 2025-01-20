import { supabase } from './Supabase.js';

export async function registerUser(email, password) {
    try {
        const { user, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        console.log('User registered successfully:', user);
        return user;
    } catch (err) {
        console.error('Registration failed:', err.message);
        return null;
    }
}


export async function loginUser(email, password) {
    try {
        const { user, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        console.log('User logged in successfully:', user);
        return user;
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
