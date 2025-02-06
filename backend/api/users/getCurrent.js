const express = require('express');
const router = express.Router();
const supabase = require('../../config');

router.post('/get-current', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Fetch user by ID
        const { data, error } = await supabase
            .from('users')
            .select('id, name, highscore, admin')
            .eq('id', userId)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Current user:', data);
        res.json(data);
    } catch (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
