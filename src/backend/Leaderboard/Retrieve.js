import { supabase } from '../Supabase.js';

export async function getLeaderboard() {
    try {
        console.log('Fetching leaderboard from database...');
        
        const { data, error } = await supabase
            .from('users')
            .select('id, name, highscore')
            .order('highscore', { ascending: false })
            // .limit(10);

        console.log('Database response:', data); 

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Failed to fetch leaderboard:', err.message);
        return [];
    }
}
