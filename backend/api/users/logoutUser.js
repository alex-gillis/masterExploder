import { supabase } from './Supabase.js';

export async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        console.log('User logged out successfully');
    } catch (err) {
        console.error('Logout failed:', err.message);
    }
}