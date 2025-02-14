import { supabase } from '../Supabase.js';

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching current user:', error.message);
        return null;
    }

    console.log('Current user:', user);
    return user;
}