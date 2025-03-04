import { supabase } from '../Supabase.js';

export async function getUserWaveData(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('waveNumber, currentEnemies, currentScore')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error retrieving user wave data:', error);
            return { waveNumber: 1, currentEnemies: 0, currentScore: 0 }; // Default values if no record exists
        }

        console.log(`User ${userId} wave data retrieved:`, data);
        return data;
    } catch (err) {
        console.error('Unexpected error retrieving wave data:', err);
        return { waveNumber: 1, currentEnemies: 0, currentScore: 0 };
    }
}
