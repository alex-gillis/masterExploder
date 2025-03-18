import * as THREE from 'three';
import { createShip } from './components/entities/player/Ship.js';
import { createTarget, animateTargets } from './components/entities/enemies/Targets.js';
import { shootBullet, updateBullets } from './components/entities/misc/Bullets.js';
import { createHUD, updateHUD } from './components/menus/HUD.js';
import { gameOver } from './components/menus/GameOver.js';
import { showMenu } from './components/menus/Menu.js';
import { checkCollisions } from './components/entities/misc/Collisions.js';
import { updateHighScore } from './backend/Leaderboard/Update.js';
import { getUserWaveData } from './backend/Waves/Retrieve.js';
import { updateUserWaveData } from './backend/Waves/Update.js';

// Check if user is logged in
const userId = localStorage.getItem('userId');
const username = localStorage.getItem('username');

if (!userId) {
    console.warn('No user found in localStorage. Redirecting to login...');
} else {
    console.log('User authenticated:', { userId, username });
}

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(115, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 16, window.innerHeight - 16);
document.body.appendChild(renderer.domElement);

const gameRunning = { value: true }; 
const DEBUG_MODE = false;
const bullets = [];
const enemyBullets = [];
const targets = [];
const keys = {}; 

const backgroundMusic = new Audio('./assets/sounds/theme.mp3');
const laserSound = new Audio('../assets/sounds/ship-laser.mp3');
const playerDeath = new Audio('../assets/sounds/gameover-explosion.mp3');
const enemyDeath = new Audio('../assets/sounds/enemy-explode.mp3');

backgroundMusic.volume = 0.15;
laserSound.volume = 0.1; 
playerDeath.volume = 1; 
enemyDeath.volume = 0.3; 

backgroundMusic.loop = true;

function muteMusic() {
    if (backgroundMusic.volume === 0) { backgroundMusic.volume = 0.2; } 
    else { backgroundMusic.volume = 0; }
}

function muteSound() {
    if (laserSound.volume === 0) { laserSound.volume = 0.1; } 
    else { laserSound.volume = 0; }
    
    if (playerDeath.volume === 0) { playerDeath.volume = 1; } 
    else { playerDeath.volume = 0; }
    
    if (enemyDeath.volume === 0) { enemyDeath.volume = 0.3; } 
    else { enemyDeath.volume = 0; }
}

function playEnemyDeath() {
    if (enemyDeath.volume !== 0) {
        const clone = enemyDeath.cloneNode(true);
        clone.volume = enemyDeath.volume;
        clone.play();
    }
}

// Initialize HUD
const { scoreElement, healthElement, waveElement } = createHUD();
let score = { value: 0 }; 
const health = { value: 3 }; 

let gameState = 'menu'; 

// Ship Stats
let fireRate = 300;
let moveSpeed = 0.1;
let lastHitTime = 0; 
let lastFired = 0;

// Create Ship & Targets
const ship = createShip(scene);

// Show Main Menu
showMenu('menu', startGame, resetGame, resumeGame, muteMusic, muteSound);
animate();
camera.position.z = 10;

// Declare Global Variables
let waveNumber = 0; 
let enemiesRemaining = { value: 0 };
let waveActive = false; 
let startUp = true;

// Retrieve user progress when they log in
async function loadUserProgress() {
    const userWaveData = await getUserWaveData(userId);
    
    if (userWaveData) {
        waveNumber = userWaveData.waveNumber || 1;
        enemiesRemaining.value = userWaveData.currentEnemies || 3;
        score.value = userWaveData.currentScore || 0;
        health.value = userWaveData.currentHealth || 0;
    } else {
        console.warn(`User ${userId} has no wave data, starting fresh.`);
        waveNumber = 1;
        enemiesRemaining.value = 3;
        score.value = 0;
        health.value = 3;
    }

    console.log(`Loaded User ${userId} progress - Wave: ${waveNumber}, Enemies Remaining: ${enemiesRemaining.value}, Score: ${score.value}`);
}

// Update user progress when a wave ends
async function updateUserProgress() {
    await updateUserWaveData(userId, waveNumber, enemiesRemaining.value, score.value, health.value);
}

async function spawnWave(scene) {
    waveActive = true;
    if (!startUp) {
        waveNumber++; // Move to the next wave
        enemiesRemaining.value = waveNumber * 3; 
    }
    startUp = false;
    

    console.log(`Starting Wave ${waveNumber} with ${enemiesRemaining.value} enemies.`);

    updateHUD(scoreElement, healthElement, waveElement, score.value, health.value, waveNumber);

    for (let i = 0; i < enemiesRemaining.value; i++) {
        let x = (Math.random() - 0.5) * 10;
        let y = Math.random() * 10 + 5;
        let position = new THREE.Vector3(x, y, 0);
        createTarget(scene, targets, position, DEBUG_MODE, enemiesRemaining, updateUserProgress);
    }

    await updateUserProgress(); // Save wave progress
}

// Check if all enemies are destroyed and save progress
function checkWaveCompletion(myScene) {
    if (enemiesRemaining.value == 0 && !waveActive) {
        waveActive = false;
        waveNumber++;

        setTimeout(() => {
            console.log(`Wave ${waveNumber} incoming...`);
            spawnWave(myScene);
        }, 3000);
    }
}

// Call `loadUserProgress()` when the game starts
await loadUserProgress();

async function handleGameOver() {
    playerDeath.play();
    await gameOver(score.value, resetGame, gameRunning, userId);
    gameState = 'pause';
    await updateHighScore(userId, score.value);
}

function resumeGame() {
    if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('menu')?.remove(); // Remove menu if exists
        animate(); // Restart the game loop
    }
}

async function resetGame() {
    waveNumber = 1;
    enemiesRemaining.value = 3;
    score.value = 0;
    health.value = 3;
    await updateUserWaveData(userId, 1, 3, 0, 3);
    window.location.reload();
}

// Track Keyboard Input
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);
window.addEventListener('keydown', (event) => { keys[event.key.toLowerCase()] = true; });
window.addEventListener('keyup', (event) => { keys[event.key.toLowerCase()] = false; });

// Move Ship Function
function moveShip() {
    if (keys['ArrowLeft'] || keys['a']) ship.position.x -= moveSpeed;
    if (keys['ArrowRight'] || keys['d']) ship.position.x += moveSpeed;
    if (keys['ArrowDown'] || keys['s']) ship.position.y -= moveSpeed * 0.5;
    if (keys['ArrowUp'] || keys['w']) ship.position.y += moveSpeed * 0.5;
    ship.position.x = THREE.MathUtils.clamp(ship.position.x, -10, 10);
    ship.position.y = THREE.MathUtils.clamp(ship.position.y, -10, 10);
    
    // pause game
    if (keys['p'] || keys['escape']) {
        showMenu('paused', startGame, resetGame, resumeGame, muteMusic, muteSound);
        gameState = "paused"
    }
}

// Shoot Bullets
window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        const currentTime = Date.now();
        if (currentTime - lastFired >= fireRate) {
            shootBullet(scene, bullets, ship, DEBUG_MODE);
            laserSound.currentTime = 0; 
            laserSound.play(); 
            lastFired = currentTime;
        }
    }
});

// Update the Game Loop
function animate() {
    if (gameState !== 'playing') return;
    animationFrameId = requestAnimationFrame(animate);

    moveShip();
    updateBullets(scene, bullets);
    animateTargets(scene, targets, enemyBullets);

    lastHitTime = checkCollisions(
        scene,
        bullets,
        enemyBullets,
        targets,
        ship,
        score,
        health,
        updateHUD,
        handleGameOver,
        scoreElement,
        healthElement,
        waveElement,
        lastHitTime,
        resetGame,
        gameRunning,
        spawnWave,
        waveNumber,
        waveActive,
        enemiesRemaining, 
        playEnemyDeath
    );

    checkWaveCompletion(scene);
    
    if (health.value >= 1 && gameState == 'playing') {
        updateUserProgress()
    }

    renderer.render(scene, camera);
}

let animationFrameId;

// Start Game
async function startGame() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    }
    gameState = 'playing';
    document.getElementById('menu').remove();
    spawnWave(scene);
    animate();
}