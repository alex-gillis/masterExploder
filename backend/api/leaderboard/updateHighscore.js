const express = require('express');
const router = express.Router();
const supabase = require('../../config');

router.post('/update-highscore', async (req, res) => {
    try {
        const { userId, newScore } = req.body;

        if (!userId || newScore == null) {
            return res.status(400).json({ error: 'User ID and score required' });
        }

        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('highscore')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const currentHighScore = userData ? userData.highscore : 0;

        if (newScore > currentHighScore) {
            const { error } = await supabase
                .from('users')
                .update({ highscore: newScore })
                .eq('id', userId);

            if (error) throw error;

            res.status(200).json({ message: 'High score updated', newScore });
        } else {
            res.status(200).json({ message: 'No update needed', currentHighScore });
        }
    } catch (err) {
        console.error('Failed to update high score:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 
