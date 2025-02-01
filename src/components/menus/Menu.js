export function showMenu(state, startGame, resetGame, resumeGame) {
    const existingMenu = document.getElementById('menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.id = 'menu';
    menu.style.position = 'absolute';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
    menu.style.textAlign = 'center';
    menu.style.color = 'white';
    menu.style.fontSize = '24px';

    switch (state) {
        case 'menu':
            menu.innerHTML = `
                <h1>Main Menu</h1>
                <button id="startGame">Start Game</button>
                <button id="leaderboard">Leaderboard</button>
                <button id="logout">Logout</button>
            `;
            document.body.appendChild(menu);

            document.getElementById('startGame').addEventListener('click', startGame);
            document.getElementById('leaderboard').addEventListener('click', () => {
                window.location.href = './leaderboard.html';
            });

            // ✅ Now we ensure the Logout button gets its event
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    localStorage.clear();
                    window.location.href = './login.html';
                });
            } else {
                console.warn("Logout button not found in Menu.");
            }
            break;

        case 'paused': // Pause Menu (Now includes Logout)
            menu.innerHTML = `
                <h1>Paused</h1>
                <button id="resumeGame">Resume</button>
                <button id="resetGame">Restart</button>
                <button id="leaderboard">Leaderboard</button>
                <button id="logout">Logout</button>
            `;
            document.body.appendChild(menu);
            document.getElementById('resumeGame').addEventListener('click', resumeGame);
            document.getElementById('resetGame').addEventListener('click', resetGame);
            document.getElementById('leaderboard').addEventListener('click', () => {
                window.location.href = './leaderboard.html';
            });
            document.getElementById('logout').addEventListener('click', () => {
                localStorage.clear();
                window.location.href = './login.html';
            });
            break;

        case 'gameOver': // Game Over Menu
            menu.innerHTML = `
                <h1>Game Over</h1>
                <button id="resetGame">Restart</button>
                <button id="leaderboard">Leaderboard</button>
                <button id="logout">Logout</button>
            `;
            document.body.appendChild(menu);
            document.getElementById('resetGame').addEventListener('click', resetGame);
            document.getElementById('leaderboard').addEventListener('click', () => {
                window.location.href = './leaderboard.html';
            });
            document.getElementById('logout').addEventListener('click', () => {
                localStorage.clear();
                window.location.href = './login.html';
            });
            break;
    }
}
