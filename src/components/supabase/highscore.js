import { supabase } from './Supabase.js';

export async function getUserHighScore(userId) {
    const { data, error } = await supabase
        .from('users')
        .select('highscore')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data.highscore;
}

export async function updateHighScore(userId, newHighScore) {
    const { data, error } = await supabase
        .from('users')
        .update({ highscore: newHighScore })
        .eq('id', userId);

    if (error) throw error;
    return data;
}
