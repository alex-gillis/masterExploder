import { supabase } from '../Supabase.js';
import bcrypt from 'bcryptjs';

export async function registerUser(username, email, password) {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Insert into `users` table
        const { data, error } = await supabase
            .from('users')
            .insert([{ name: username, email, password: hashedPassword, highscore: 0, admin: false }])
            .select('id')
            .single(); // Ensure we get back the `id`

        if (error) throw error;

        console.log('User registered successfully:', data);
        return data.id; // Return user ID
    } catch (err) {
        console.error('Registration failed:', err.message);
        return null;
    }
}