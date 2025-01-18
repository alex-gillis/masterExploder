import * as THREE from 'three';
import { createShip } from './components/entities/player/Ship.js';
import { createTarget, animateTargets } from './components/entities/enemies/Targets.js';
import { shootBullet, updateBullets } from './components/entities/misc/Bullets.js';
import { createHUD, updateHUD } from './components/menus/HUD.js';
import { gameOver } from './components/menus/GameOver.js';
import { checkCollisions } from './components/entities/misc/Collisions.js';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ikvmctpberzquhmcqofh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Scene, Camera, Renderer Setup
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

// Ship Stats
let fireRate = 300;
let moveSpeed = 0.1;

// Enemy Stats
let enemyFireRate = 2000; // 2 seconds

// Cooldowns
let lastFired = 0;
let lastHitTime = 0; 

const ship = createShip(scene);
createTarget(scene, targets, new THREE.Vector3(2, 2, 0), DEBUG_MODE, 'oscillate');
createTarget(scene, targets, new THREE.Vector3(-2, 0, 0), DEBUG_MODE, 'zigzag');
createTarget(scene, targets, new THREE.Vector3(0, 5 , 0), DEBUG_MODE, 'circular');


function resetGame() {
    window.location.href = window.location.href;
}

animateTargets(scene, targets, enemyBullets, enemyFireRate);

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
    if (!gameRunning.value) return; 

    requestAnimationFrame(animate);

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
        gameOver,
        scoreElement,
        healthElement,
        lastHitTime,
        resetGame,
        gameRunning
    );

    renderer.render(scene, camera);
}

animate();

camera.position.z = 10;
