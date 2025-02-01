import { updateHighScore } from '../supabase/Users.js';

export async function gameOver(score, resetGame, gameRunningRef, userId) {
    gameRunningRef.value = false; // Stop the game loop

    if (!userId) {
        console.error('User ID is missing. Cannot save high score.');
        return;
    }

    try {
        // Update high score if applicable
        await updateHighScore(userId, score);
    } catch (error) {
        console.error('Error updating high score:', error.message);
        return;
    }

    // Display the Game Over Menu
    const gameOverScreen = document.createElement('div');
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '50%';
    gameOverScreen.style.left = '50%';
    gameOverScreen.style.transform = 'translate(-50%, -50%)';
    gameOverScreen.style.color = 'white';
    gameOverScreen.style.fontSize = '30px';
    gameOverScreen.style.textAlign = 'center';

    gameOverScreen.innerHTML = `
        <h1>Game Over</h1>
        <p>Score: ${score}</p>
        <button id="restart">Restart</button>
        <button id="leaderboard">View Leaderboard</button>
    `;
    document.body.appendChild(gameOverScreen);

    document.getElementById('restart').addEventListener('click', () => {
        resetGame();
    });

    document.getElementById('leaderboard').addEventListener('click', () => {
        window.location.href = './leaderboard.html';
    });
}


// export async function gameOver(score, resetGame, gameRunningRef, userId) {
//     gameRunningRef.value = false; // Stop the game loop

//     // Fetch current high score
//     const currentHighScore = await getUserHighScore(userId);

//     // Update high score if the new score is higher
//     if (score > currentHighScore) {
//         await updateHighScore(userId, score);
//     }

//     // Display Game Over Screen
//     const gameOverScreen = document.createElement('div');
//     gameOverScreen.style.position = 'absolute';
//     gameOverScreen.style.top = '50%';
//     gameOverScreen.style.left = '50%';
//     gameOverScreen.style.transform = 'translate(-50%, -50%)';
//     gameOverScreen.style.color = 'white';
//     gameOverScreen.style.fontSize = '30px';
//     gameOverScreen.style.textAlign = 'center';

//     gameOverScreen.innerHTML = `
//         Game Over!<br>
//         Score: ${score}<br>
//         High Score: ${Math.max(score, currentHighScore)}<br>
//         <button id="restart">Restart</button>
//     `;
//     document.body.appendChild(gameOverScreen);

//     document.getElementById('restart').addEventListener('click', () => {
//         resetGame();
//     });
// }

// export function gameOver(score, resetGame, gameRunningRef) {
//     gameRunningRef.value = false; // Set gameRunning to false

//     const gameOverScreen = document.createElement('div');
//     gameOverScreen.style.position = 'absolute';
//     gameOverScreen.style.top = '50%';
//     gameOverScreen.style.left = '50%';
//     gameOverScreen.style.transform = 'translate(-50%, -50%)';
//     gameOverScreen.style.color = 'white';
//     gameOverScreen.style.fontSize = '30px';
//     gameOverScreen.style.textAlign = 'center';
//     gameOverScreen.innerHTML = `
//         Game Over!<br>
//         Score: ${score}<br>
//         <button id="restart">Restart</button>
//     `;
//     document.body.appendChild(gameOverScreen);

//     document.getElementById('restart').addEventListener('click', () => {
//         resetGame(); // Call the reset function
//     });
// }
