export function showMenu(state, startGame, resetGame, resumeGame) {
    // Clear existing menus
    const existingMenu = document.getElementById('menu');
    if (existingMenu) existingMenu.remove();

    // Create a container for the menu
    const menu = document.createElement('div');
    menu.id = 'menu';
    menu.style.position = 'absolute';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.textAlign = 'center';
    menu.style.color = 'white';
    menu.style.fontSize = '24px';

    // Populate menu based on the current state
    switch (state) {
        case 'menu': // Main Menu
            menu.innerHTML = `
                <h1>Main Menu</h1>
                <button id="startGame">Start Game</button>
            `;
            document.body.appendChild(menu);
            document.getElementById('startGame').addEventListener('click', startGame);
            break;

        case 'paused': // Pause Menu
            menu.innerHTML = `
                <h1>Paused</h1>
                <button id="resumeGame">Resume</button>
                <button id="resetGame">Restart</button>
            `;
            document.body.appendChild(menu);
            document.getElementById('resumeGame').addEventListener('click', resumeGame);
            document.getElementById('resetGame').addEventListener('click', resetGame);
            break;

        case 'gameOver': // Game Over Menu
            menu.innerHTML = `
                <h1>Game Over</h1>
                <button id="resetGame">Restart</button>
            `;
            document.body.appendChild(menu);
            document.getElementById('resetGame').addEventListener('click', resetGame);
            break;
    }
}
