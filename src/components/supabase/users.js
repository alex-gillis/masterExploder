import { supabase } from './Supabase.js';
import bcrypt from 'bcryptjs';

export async function registerUser(username, password) {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Insert into `users` table
        const { data, error } = await supabase
            .from('users')
            .insert([{ name: username, password: hashedPassword, highscore: 0, admin: false }])
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

export async function loginUser(username, password) {
    try {
        console.log('Logging in with username:', username);

        // Fetch user by username
        const { data, error } = await supabase
            .from('users')
            .select('id, name, password, highscore, admin')
            .eq('name', username)
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
        return { id: data.id, username: data.name, highscore: data.highscore, admin: data.admin };
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

export async function updateHighScore(userId, newScore) {
    try {
        // Fetch the user's current high score
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('highscore')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const currentHighScore = userData ? userData.highscore : 0;

        if (newScore > currentHighScore) {
            const { data, error } = await supabase
                .from('users')
                .update({ highscore: newScore })
                .eq('id', userId);

            if (error) throw error;

            console.log(`High score updated: ${newScore}`);
            return data;
        } else {
            console.log('New score is lower than current high score. No update needed.');
            return null;
        }
    } catch (err) {
        console.error('Failed to update high score:', err.message);
        return null;
    }
}