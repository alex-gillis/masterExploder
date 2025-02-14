import { supabase } from '../Supabase.js';

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