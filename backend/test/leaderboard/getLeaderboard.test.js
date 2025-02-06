import { supabase } from './Supabase.js';

export async function getLeaderboard() {
    try {
        // Get the top 10 players sorted by high score
        const { data, error } = await supabase
            .from('users')
            .select('name, highscore')
            .order('highscore', { ascending: false }) // Highest to lowest
            .limit(10);

        if (error) throw error;

        console.log('Leaderboard:', data);
        return data;
    } catch (err) {
        console.error('Failed to fetch leaderboard:', err.message);
        return [];
    }
}