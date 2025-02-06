const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const supabase = require('../../config');

router.post('/register-user', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Insert into `users` table
        const { data, error } = await supabase
            .from('users')
            .insert([{ name: username, password: hashedPassword, highscore: 0, admin: false }])
            .select('id')
            .single();

        if (error) throw error;

        console.log('User registered successfully:', data);
        res.status(201).json({ userId: data.id, message: 'Registration successful' });
    } catch (err) {
        console.error('Registration failed:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
