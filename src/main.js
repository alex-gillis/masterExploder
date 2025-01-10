import * as THREE from 'three';
import { createShip } from './components/Ship.js';
import { createTarget, animateTargets } from './components/Targets.js';
import { shootBullet, updateBullets } from './components/Bullets.js';
import { createHUD, updateHUD } from './components/HUD.js';
import { gameOver } from './components/GameOver.js';
import { checkCollisions } from './components/Collisions.js';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 20, window.innerHeight - 32);
document.body.appendChild(renderer.domElement);

const DEBUG_MODE = false;
const bullets = [];
const enemyBullets = []; // Bullets fired by targets
const targets = [];

// Initialize HUD
const { scoreElement, healthElement } = createHUD();
const score = { value: 0 }; 
const health = { value: 3 }; 

// ship stats
let fireRate = 300;
let moveSpeed = 0.1;

// enemy stats
let enemyFireRate = 2000; // 2 seconds

// cooldowns
let lastFired = 0;
let lastHitTime = 0; 

const ship = createShip(scene);
createTarget(scene, targets, new THREE.Vector3(2, 2, 0), DEBUG_MODE);
createTarget(scene, targets, new THREE.Vector3(-2, 3, 0), DEBUG_MODE);
createTarget(scene, targets, new THREE.Vector3(0, 4, 0), DEBUG_MODE);

function resetGame() {
    window.location.href = window.location.href;
}

animateTargets(scene, targets, enemyBullets, enemyFireRate);

// Global Variables
const keys = {}; // Object to track key states

// Track Keyboard Input
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

// Move Ship Function
function moveShip() {
    if (keys['ArrowLeft']) ship.position.x -= moveSpeed;
    if (keys['ArrowRight']) ship.position.x += moveSpeed;

    // Clamp ship position within screen bounds
    ship.position.x = THREE.MathUtils.clamp(ship.position.x, -10, 10);
}

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        const currentTime = Date.now();
        if (currentTime - lastFired >= fireRate) {
            shootBullet(scene, bullets, ship, DEBUG_MODE);
            lastFired = currentTime;
        }
    }
});


function animate() {
    requestAnimationFrame(animate);

    moveShip();
    updateBullets(scene, bullets);
    animateTargets(scene, targets, enemyBullets, enemyFireRate);

    // Pass resetGame to checkCollisions
    lastHitTime = checkCollisions(
        scene,
        bullets,
        enemyBullets,
        targets,
        ship,
        score,
        health,
        updateHUD,
        gameOver,
        scoreElement,
        healthElement,
        lastHitTime,
        resetGame 
    );

    renderer.render(scene, camera);
}


animate();

camera.position.z = 10;
