import { supabase } from '../Supabase.js';

export async function updateHighScore(userId, newScore) {
    try {
        console.log('Checking existing high score for user:', userId);

        // Fetch the user's current high score
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('highscore')
            .eq('id', userId)
            .single();

        console.log('Existing high score:', userData, 'Error:', fetchError);

        if (fetchError) throw fetchError;

        const currentHighScore = userData ? userData.highscore : 0;

        if (newScore > currentHighScore) {
            console.log(`Updating high score for ${userId}: ${newScore}`);

            const { data, error } = await supabase
                .from('users')
                .update({ highscore: newScore })
                .eq('id', userId)
                .select();

            console.log('Update result:', data, 'Error:', error);

            if (error) throw error;

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
