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
    window.location.href = './login.html';
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

// Initialize HUD
const { scoreElement, healthElement, waveElement } = createHUD();
let score = { value: 0 }; 
const health = { value: 3 }; 

let gameState = 'menu'; 

// Ship Stats
let fireRate = 300;
let moveSpeed = 0.1;

let lastHitTime = 0; 

// Create Ship & Targets
const ship = createShip(scene);
// createTarget(scene, targets, new THREE.Vector3(2, 2, 0), DEBUG_MODE, 'oscillate');
// createTarget(scene, targets, new THREE.Vector3(-2, 0, 0), DEBUG_MODE, 'zigzag');
// createTarget(scene, targets, new THREE.Vector3(0, 5 , 0), DEBUG_MODE, 'circular');

// Show Main Menu
showMenu('menu', startGame, resetGame, resumeGame);
animate();
camera.position.z = 10;

// Resume Game
function resumeGame() {
    if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('menu')?.remove(); // Remove menu if exists
        animate(); // Restart the game loop
    }
}

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
        enemiesRemaining.value = userWaveData.currentEnemies || 0;
        score.value = userWaveData.currentScore || 0;
    } else {
        console.warn(`User ${userId} has no wave data, starting fresh.`);
        waveNumber = 1;
        enemiesRemaining.value = 0;
        score.value = 0;
    }

    console.log(`Loaded User ${userId} progress - Wave: ${waveNumber}, Enemies Remaining: ${enemiesRemaining.value}, Score: ${score.value}`);
}

// Update user progress when a wave ends
async function updateUserProgress() {
    await updateUserWaveData(userId, waveNumber, enemiesRemaining.value, score.value);
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

// Game Over Handling
async function handleGameOver() {
    await updateHighScore(userId, score.value);
    await gameOver(score.value, resetGame, gameRunning, userId);
}

function resetGame() {
    updateUserWaveData(userId, 1, 3, 0);
    window.location.reload();
}

// Track Keyboard Input
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);
window.addEventListener('keydown', (event) => { keys[event.key.toLowerCase()] = true; });
window.addEventListener('keyup', (event) => { keys[event.key.toLowerCase()] = false; });

// Move Ship Function
function moveShip() {
    if (keys['ArrowLeft']) ship.position.x -= moveSpeed;
    if (keys['ArrowRight']) ship.position.x += moveSpeed;
    if (keys['ArrowDown']) ship.position.y -= moveSpeed * 0.5;
    if (keys['ArrowUp']) ship.position.y += moveSpeed * 0.5;
    if (keys['a']) ship.position.x -= moveSpeed;
    if (keys['d']) ship.position.x += moveSpeed;
    if (keys['s']) ship.position.y -= moveSpeed * 0.5;
    if (keys['w']) ship.position.y += moveSpeed * 0.5;
    ship.position.x = THREE.MathUtils.clamp(ship.position.x, -10, 10);
    ship.position.y = THREE.MathUtils.clamp(ship.position.y, -10, 10);
}

// Declare lastFired globally
let lastFired = 0;

// Shoot Bullets
window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        const currentTime = Date.now();
        if (currentTime - lastFired >= fireRate) {
            shootBullet(scene, bullets, ship, DEBUG_MODE);
            lastFired = currentTime; //  Update lastFired to prevent spamming
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
        enemiesRemaining
    );
    

    checkWaveCompletion(scene);
    renderer.render(scene, camera);
}

let animationFrameId;

// Start Game
function startGame() {
    gameState = 'playing';
    document.getElementById('menu').remove();
    spawnWave(scene);
    animate();
}