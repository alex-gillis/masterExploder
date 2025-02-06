const express = require('express');
const router = express.Router();

router.post('/logout-user', async (req, res) => {
    try {
        console.log('User logged out successfully');
        res.json({ message: 'User logged out' });
    } catch (err) {
        console.error('Logout failed:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
