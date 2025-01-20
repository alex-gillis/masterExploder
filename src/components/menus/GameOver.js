import { updateHighScore, getUserHighScore } from '../supabase/Highscore.js';

export async function gameOver(score, resetGame, gameRunningRef, userId) {
    gameRunningRef.value = false; // Stop the game loop

    let highScore = score;

    // Fetch and update the high score
    if (userId) {
        const currentHighScore = await getUserHighScore(userId);
        highScore = Math.max(score, currentHighScore);

        if (score > currentHighScore) {
            await updateHighScore(userId, score);
        }
    } else {
        console.warn('User is not logged in. High score will not be saved.');
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
        Game Over!<br>
        Score: ${score}<br>
        High Score: ${highScore}<br>
        <button id="restart">Restart</button>
    `;
    document.body.appendChild(gameOverScreen);

    document.getElementById('restart').addEventListener('click', () => {
        resetGame();
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
