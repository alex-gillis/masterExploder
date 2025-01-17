export function gameOver(score, resetGame, gameRunningRef) {
    gameRunningRef.value = false; // Set gameRunning to false

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
        <button id="restart">Restart</button>
    `;
    document.body.appendChild(gameOverScreen);

    document.getElementById('restart').addEventListener('click', () => {
        resetGame(); // Call the reset function
    });
}
