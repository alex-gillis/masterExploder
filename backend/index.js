const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const leaderboardRoutes = require('./routes/leaderboard'); 
const userRoutes = require('./routes/users'); 
const highscoreRoutes = require('./routes/updateHighscore'); 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', leaderboardRoutes);
app.use('/api', userRoutes);
app.use('/api', highscoreRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; 
