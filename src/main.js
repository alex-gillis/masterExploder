import * as THREE from 'three';
import { createShip } from './components/entities/player/Ship.js';
import { createTarget, animateTargets } from './components/entities/enemies/Targets.js';
import { shootBullet, updateBullets } from './components/entities/misc/Bullets.js';
import { createHUD, updateHUD } from './components/menus/HUD.js';
import { gameOver } from './components/menus/GameOver.js';
import { showMenu } from './components/menus/Menu.js';
import { checkCollisions } from './components/entities/misc/Collisions.js';
import { updateHighScore } from './components/supabase/Users.js';

// **Check if the user is logged in using localStorage**
const userId = localStorage.getItem('userId');
const username = localStorage.getItem('username');

if (!userId) {
    console.warn('No user found in localStorage. Redirecting to login...');
    window.location.href = './login.html';
} else {
    console.log('User authenticated:', { userId, username });
}

// **Scene, Camera, Renderer Setup**
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 16, window.innerHeight - 16);
document.body.appendChild(renderer.domElement);

const gameRunning = { value: true }; // Track if the game is running

const DEBUG_MODE = false;
const bullets = [];
const enemyBullets = [];
const targets = [];
const keys = {}; 

// Initialize HUD
const { scoreElement, healthElement } = createHUD();
const score = { value: 0 }; 
const health = { value: 3 }; 

let gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver'

// 🚀 **Ship Stats**
let fireRate = 300;
let moveSpeed = 0.1;

// 🎯 **Enemy Stats**
let enemyFireRate = 2000; // 2 seconds

// 🔄 **Cooldowns**
let lastFired = 0;
let lastHitTime = 0; 

// **Create Ship & Targets**
const ship = createShip(scene);
createTarget(scene, targets, new THREE.Vector3(2, 2, 0), DEBUG_MODE, 'oscillate');
createTarget(scene, targets, new THREE.Vector3(-2, 0, 0), DEBUG_MODE, 'zigzag');
createTarget(scene, targets, new THREE.Vector3(0, 5 , 0), DEBUG_MODE, 'circular');

function startGame() {
    gameState = 'playing';
    document.getElementById('menu').remove(); // Remove menu
    animate(); // Start the game loop
}

function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        cancelAnimationFrame(animationFrameId); // Stop animation
        showMenu('paused', startGame, resetGame, resumeGame);
    }
}

function resumeGame() {
    if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('menu').remove(); // Remove menu
        animate(); // Restart the game loop
    }
}

// **Game Over Handling**
async function handleGameOver() {
    await updateHighScore(userId, score.value); // Save the high score
    await gameOver(score.value, resetGame, gameRunning, userId);
}

function resetGame() {
    window.location.reload(); // Reload the page to reset the game
}

// **Track Keyboard Input**
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

// 🎮 **Move Ship Function**
function moveShip() {
    if (keys['ArrowLeft']) ship.position.x -= moveSpeed;
    if (keys['ArrowRight']) ship.position.x += moveSpeed;

    // Clamp ship position within screen bounds
    ship.position.x = THREE.MathUtils.clamp(ship.position.x, -10, 10);
}

// **Shoot Bullets**
window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        const currentTime = Date.now();
        if (currentTime - lastFired >= fireRate) {
            shootBullet(scene, bullets, ship, DEBUG_MODE);
            lastFired = currentTime;
        }
    }
});

let animationFrameId;

// **Game Loop**
function animate() {
    if (gameState !== 'playing') return; // Stop animation if not playing

    animationFrameId = requestAnimationFrame(animate);

    moveShip();
    updateBullets(scene, bullets);
    animateTargets(scene, targets, enemyBullets, enemyFireRate);

    lastHitTime = checkCollisions(
        scene,
        bullets,
        enemyBullets,
        targets,
        ship,
        score,
        health,
        updateHUD,
        handleGameOver, // Call the combined gameOver function
        scoreElement,
        healthElement,
        lastHitTime,
        resetGame
    );

    renderer.render(scene, camera);
}

// **Show Main Menu**
showMenu('menu', startGame, resetGame, resumeGame);
animate();
camera.position.z = 10;
