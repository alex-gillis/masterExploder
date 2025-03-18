import { getLeaderboard } from '../../backend/Leaderboard/Retrieve.js';
import { loginUser } from '../../backend/Users/Login.js';
import { registerUser } from '../../backend/Users/Register.js';
// import { loginWithAuth0, logout, getUser } from '../../functions/auth.js';


export function showMenu(state, startGame, resetGame, resumeGame, muteMusic, muteSound) {
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

    const userId = localStorage.getItem('userId'); 

    switch (state) {
        case 'menu':
            menu.innerHTML = `
            <h1>Master Exploder</h1>
            <h3>Main Menu</h3>
            `;

            if (userId) {
                menu.innerHTML += `
                    <button id="startGame">Start Game</button>
                    <br/>
                    <button id="leaderboard">Leaderboard</button>
                    <br/>
                    <button id="logout">Logout</button>
                `;
            } else {
                menu.innerHTML += `
                    <button id="login">Login</button>
                    <button id="register">Register</button>
                `;
            }

            document.body.appendChild(menu);

            if (userId) {
                document.getElementById('startGame')?.addEventListener('click', startGame);
                document.getElementById('leaderboard')?.addEventListener('click', () => showMenu('leaderboard'));
                document.getElementById('logout')?.addEventListener('click', () => {
                    localStorage.clear();
                    showMenu('menu');
                });
            } else {
                document.getElementById('login')?.addEventListener('click', () => showMenu('login'));
                document.getElementById('register')?.addEventListener('click', () => showMenu('register'));
            }
        break;

        case 'paused': // Pause Menu (Now includes Logout)
            menu.innerHTML = `
                <h1>Master Exploder</h1>
                <h3>Paused</h3>
                <button id="resumeGame">Resume</button>
                <br/>
                <button id="music">Mute Music</button>
                <button id="sound">Mute Sound</button>
                <br/>
                <button id="resetGame">Restart</button>
            `;
            document.body.appendChild(menu);
            document.getElementById('resumeGame').addEventListener('click', resumeGame);
            document.getElementById('resetGame').addEventListener('click', resetGame);
            document.getElementById('music').addEventListener('click', muteMusic);
            document.getElementById('sound').addEventListener('click', muteSound);
        break;

        case 'leaderboard':
            menu.innerHTML = `
                <h1>Master Exploder</h1>
                <h3>Leaderboard</h3>
                <button id="back-to-menu">Back to Menu</button>
                <div id="leaderboard"></div>
            `;

            document.body.appendChild(menu);

            document.getElementById('back-to-menu')?.addEventListener('click', () => showMenu('menu'));

            getLeaderboard().then(leaderboardData => {
                const leaderboardList = document.getElementById('leaderboard');
                leaderboardList.innerHTML = '';

                leaderboardData.forEach((user, index) => {
                    const listItem = document.createElement('span');
                    listItem.textContent = `${index + 1}. ${user.name} - ${user.highscore} points`;
                    leaderboardList.appendChild(listItem);
                });
            });
        break;

        case 'login':
            menu.innerHTML = `
                <h1>Master Exploder</h1>
                <h3>Login</h3>
                <input type="text" id="username" placeholder="Username" required />
                <input type="password" id="password" placeholder="Password" required />
                <button id="login-btn">Login</button>
                <p id="status"></p>
                <p>Don't have an account? <button id="go-to-register">Register</button></p>
            `;

            document.body.appendChild(menu);

            document.getElementById('login-btn')?.addEventListener('click', async () => {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const status = document.getElementById('status');

                if (!username || !password) {
                    status.textContent = 'Please enter a username and password.';
                    return;
                }

                const user = await loginUser(username, password);

                if (user) {
                    localStorage.setItem('userId', user.id);
                    localStorage.setItem('username', user.username);
                    localStorage.setItem('highscore', user.highscore);
                    window.location.reload();
                    // showMenu('menu');
                } else {
                    status.textContent = 'Login failed. Check username and password.';
                }
            });

            document.getElementById('go-to-register')?.addEventListener('click', () => showMenu('register'));
        break;

        case 'register':
            menu.innerHTML = `
                <h1>Master Exploder</h1>
                <h3>Register</h3>
                <input type="text" id="username" placeholder="Username" required />
                <input type="password" id="password" placeholder="Password" required />
                <button id="register-btn">Register</button>
                <p id="status"></p>
                <p>Already have an account? <button id="go-to-login">Login</button></p>
            `;

            document.body.appendChild(menu);

            document.getElementById('register-btn')?.addEventListener('click', async () => {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const status = document.getElementById('status');

                if (!username || !password) {
                    status.textContent = 'Please enter a username and password.';
                    return;
                }

                const user = await registerUser(username, password);

                if (user) {
                    status.textContent = 'Registration successful! Redirecting to login...';
                    setTimeout(() => showMenu('login'), 2000);
                } else {
                    status.textContent = 'Registration failed. Check console for details.';
                }
            });

            document.getElementById('go-to-login')?.addEventListener('click', () => showMenu('login'));
        break;
    }
}

