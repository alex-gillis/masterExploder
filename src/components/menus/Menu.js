import { getLeaderboard } from '../../backend/Leaderboard/Retrieve.js';
import { loginUser } from '../../backend/Users/Login.js';
import { registerUser } from '../../backend/Users/Register.js';
import { loginWithGooglePopup } from '../../functions/auth.js';
// import { loginWithAuth0, logout, getUser } from '../../functions/auth.js';

export function showMenu(state, startGame, resetGame, resumeGame, backgroundMusic, changeSound, playVolume) {
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
                    <button id="goLeaderboard">Leaderboard</button>
                    <br/>
                    <button id="logout">Logout</button>
                `;
            } else {
                menu.innerHTML += `
                    <button id="login">Login</button>
                    <button id="register">Register</button>
                    <br/>
                    <br/>
                    <button id="googlelogin">Login with<br/><i class="fab fa-google"></i>oogle</button>
                    <button id="googleregister">Register with<br/><i class="fab fa-google"></i>oogle</button>
                `;
            }

            document.body.appendChild(menu);

            if (userId) {
                document.getElementById('startGame')?.addEventListener('click', startGame);
                document.getElementById('goLeaderboard')?.addEventListener('click', () => showMenu('leaderboard'));
                document.getElementById('logout')?.addEventListener('click', () => {
                    localStorage.clear();
                    showMenu('menu');
                });
            } else {
                document.getElementById('login')?.addEventListener('click', () => showMenu('login'));
                document.getElementById('register')?.addEventListener('click', () => showMenu('register'));
                document.getElementById('googlelogin')?.addEventListener('click', async () => {
                    await loginWithGooglePopup();
                });
                document.getElementById('googleregister')?.addEventListener('click', async () => {
                    // For many OAuth providers, login and register are the same flow.
                    // You might call the same function.
                    await loginWithGooglePopup();
                });
            }
        break;

        case 'paused': // Pause Menu (Now includes Logout)
            menu.innerHTML = `
                <h1>Master Exploder</h1>
                <h3>Paused</h3>
                <button id="resumeGame">Resume</button>
                <br/>
                <label for="musicSlider">Music Volume</label>
                <input type="range" id="musicSlider" min="0" max="0.3" step="0.01" value="${backgroundMusic.volume}">
                <br/>
                <label for="soundSlider">Sound Volume</label>
                <input type="range" id="soundSlider" min="0" max="0.6" step="0.01" value="${playVolume}">
                <br/>
                <button id="resetGame">Restart</button>
                <br/>
                <button id="back-to-menu">Back to Menu</button>
            `;
            document.body.appendChild(menu);
            const musicSlider = document.getElementById('musicSlider');
            const soundSlider = document.getElementById('soundSlider');
            document.getElementById('resumeGame').addEventListener('click', resumeGame);
            document.getElementById('resetGame').addEventListener('click', resetGame);
            musicSlider.addEventListener('input', () => {
                backgroundMusic.volume = musicSlider.value;
            });
            soundSlider.addEventListener('input', () => {
                changeSound(soundSlider.value);
            });
            // document.getElementById('music').addEventListener('click', muteMusic);
            // document.getElementById('sound').addEventListener('click', muteSound);
            document.getElementById('back-to-menu')?.addEventListener('click', () => window.location.reload());
        break;

        case 'leaderboard':
            menu.innerHTML = `
                <h1>Master Exploder</h1>
                <h3>Leaderboard</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Highscore</th>
                        </tr>
                    </thead>
                    <tbody id="leaderboard"></tbody>
                </table>
                <br/>
                <button id="back-to-menu">Back to Menu</button>
            `;

            document.body.appendChild(menu);

            // document.getElementById('back-to-menu')?.addEventListener('click', () => showMenu('menu'));
            document.getElementById('back-to-menu')?.addEventListener('click', () => window.location.reload());

            getLeaderboard().then(leaderboardData => {
                const userIndex = leaderboardData.findIndex(user => user.id === Number(userId));
                const currentUser = leaderboardData[userIndex];
                // console.log(currentUser.name)

                const leaderboardList = document.getElementById('leaderboard');
                // const leaderboardUser = document.getElementById('leaderboard-user');
                leaderboardList.innerHTML = '';
                // leaderboardUser.innerHTML = '';

                leaderboardData.forEach((user, index) => {
                    const listItem = document.createElement('tr');
                    listItem.innerHTML = `
                                        <td>${index + 1}</td>
                                        <td>${user.name}</td>
                                        <td>${user.highscore} points</td>
                                        `;
                    // listItem.textContent = `${index + 1}. ${user.name} - ${user.highscore} points`;
                    leaderboardList.appendChild(listItem);
                });

                const UserListItem = document.createElement('tr');
                UserListItem.innerHTML = `
                                        <td>${userIndex + 1}</td>
                                        <td>${currentUser.name}</td>
                                        <td>${currentUser.highscore} points</td>
                                        `;

                leaderboardList.appendChild(UserListItem);
                // leaderboardUser.textContent = `${userIndex + 1}. ${currentUser.name} - ${currentUser.highscore} points`;
            });
        break;

        case 'login':
            menu.innerHTML = `
                <h1>Master Exploder</h1>
                <h3>Login</h3>
                <input type="text" id="email" placeholder="Email" required />
                <input type="password" id="password" placeholder="Password" required />
                <button id="login-btn">Login</button>
                <p id="status"></p>
                <p>Don't have an account? <button id="go-to-register">Register</button></p>
            `;

            document.body.appendChild(menu);

            document.getElementById('login-btn')?.addEventListener('click', async () => {
                const username = document.getElementById('email').value;
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
                <input type="text" id="email" placeholder="Email" required />
                <input type="password" id="password" placeholder="Password" required />
                <button id="register-btn">Register</button>
                <p id="status"></p>
                <p>Already have an account? <button id="go-to-login">Login</button></p>
            `;

            document.body.appendChild(menu);

            document.getElementById('register-btn')?.addEventListener('click', async () => {
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const status = document.getElementById('status');

                if (!username || !email || !password) {
                    status.textContent = 'Please enter a username, email and password.';
                    return;
                }

                const user = await registerUser(username, email, password);

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

