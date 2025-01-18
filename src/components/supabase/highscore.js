async function getUserHighScore(userId) {
    const { data, error } = await supabase
        .from('users')
        .select('highscore')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching high score:', error.message);
        return null;
    }

    console.log('High score retrieved:', data.highscore);
    return data.highscore;
}

async function updateHighScore(userId, newHighScore) {
    const { data, error } = await supabase
        .from('users')
        .update({ highscore: newHighScore })
        .eq('id', userId);

    if (error) {
        console.error('Error updating high score:', error.message);
        return null;
    }

    console.log('High score updated successfully:', data);
    return data;
}
