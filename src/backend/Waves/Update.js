import { supabase } from '../Supabase.js';

export async function updateUserWaveData(userId, waveNumber, currentEnemies, currentScore) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ waveNumber, currentEnemies, currentScore })
            .eq('id', userId);

        if (error) {
            console.error('Error updating user wave data:', error);
            return null;
        }

        // console.log(`Wave data for User ${userId} updated successfully:`, data);
        return data;
    } catch (err) {
        console.error('Unexpected error updating wave data:', err);
        return null;
    }
}
