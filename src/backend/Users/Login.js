import { supabase } from '../Supabase.js';
import bcrypt from 'bcryptjs';

export async function loginUser(email, password) {
    try {
        console.log('Logging in with username:', email);

        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, password, highscore, admin')
            .eq('email', email)
            .single();


        if (error || !data) {
            console.error('Login failed: User not found.');
            return null;
        }

        // Compare provided password with stored hash
        const validPassword = bcrypt.compareSync(password, data.password);
        if (!validPassword) {
            console.error('Login failed: Incorrect password.');
            return null;
        }

        console.log('User logged in:', data);
        return { id: data.id, username: data.name, email: data.email, highscore: data.highscore, admin: data.admin };

    } catch (err) {
        console.error('Login failed:', err.message);
        return null;
    }
}