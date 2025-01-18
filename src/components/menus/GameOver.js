import { updateHighScore, getUserHighScore } from '../supabase/highscore';

export async function gameOver(score, resetGame, gameRunningRef, userId) {
    gameRunningRef.value = false; // Stop the game loop

    // Fetch current high score
    const currentHighScore = await getUserHighScore(userId);

    // Update high score if the new score is higher
    if (score > currentHighScore) {
        await updateHighScore(userId, score);
    }

    // Display Game Over Screen
    const gameOverScreen = document.createElement('div');
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '50%';
    gameOverScreen.style.left = '50%';
    gameOverScreen.style.transform = 'translate(-50%, -50%)';
    gameOverScreen.style.color = 'white';
    gameOverScreen.style.fontSize = '30px';
    gameOverScreen.style.textAlign = 'center';

    gameOverScreen.innerHTML = `
        Game Over!<br>
        Score: ${score}<br>
        High Score: ${Math.max(score, currentHighScore)}<br>
        <button id="restart">Restart</button>
    `;
    document.body.appendChild(gameOverScreen);

    document.getElementById('restart').addEventListener('click', () => {
        resetGame();
    });
}
