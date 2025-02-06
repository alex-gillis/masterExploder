const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const supabase = require('../../config');

router.post('/login-user', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Fetch user by username
        const { data, error } = await supabase
            .from('users')
            .select('id, name, password, highscore, admin')
            .eq('name', username)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare password
        const validPassword = bcrypt.compareSync(password, data.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        console.log('User logged in:', data);
        res.json({ userId: data.id, username: data.name, highscore: data.highscore, admin: data.admin });
    } catch (err) {
        console.error('Login failed:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
