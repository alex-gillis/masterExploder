const express = require('express');
const router = express.Router();
const supabase = require('../../config');

router.get('/get-leaderboard', async (req, res) => {
    try {
        // Get the top 10 players sorted by high score
        const { data, error } = await supabase
            .from('users')
            .select('name, highscore')
            .order('highscore', { ascending: false }) // Highest to lowest
            .limit(10);

        if (error) throw error;

        res.status(200).json({ leaderboard: data });
    } catch (err) {
        console.error('Failed to fetch leaderboard:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;