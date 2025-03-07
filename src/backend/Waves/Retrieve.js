import { supabase } from '../Supabase.js';

export async function getUserWaveData(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('waveNumber, currentEnemies, currentScore, currentHealth')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error retrieving user wave data:', error);
            return { waveNumber: 1, currentEnemies: 3, currentScore: 0, currentHealth: 3 };
        }

        console.log(`User ${userId} wave data retrieved:`, data);
        return data;
    } catch (err) {
        console.error('Unexpected error retrieving wave data:', err);
        return { waveNumber: 1, currentEnemies: 3, currentScore: 0, currentHealth: 3 };
    }
}
