import * as THREE from 'three';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth-20, window.innerHeight-32);
document.body.appendChild(renderer.domElement);

// Debug Mode Flag
const DEBUG_MODE = false; // Set to true to enable collision box visualization

// Variables
const bullets = []; // Array to store bullets
const targets = []; // Array to store targets
let score = 0; // Player score

// Display Score
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontSize = '20px';
scoreElement.textContent = `Score: ${score}`;
document.body.appendChild(scoreElement);

// Create Ship
const shipGeometry = new THREE.ConeGeometry(0.5, 1, 3);
const shipMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ship = new THREE.Mesh(shipGeometry, shipMaterial);
ship.position.set(0, -5, 0);
scene.add(ship);

// Create a Target
function createTarget(position) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const target = new THREE.Mesh(geometry, material);
    target.position.copy(position);

    // Initialize bounding box
    const boundingBox = new THREE.Box3().setFromObject(target);

    // Create BoxHelper and toggle visibility based on DEBUG_MODE
    const helper = new THREE.BoxHelper(target, 0xff0000); // Red box for target
    helper.material.visible = DEBUG_MODE;
    scene.add(helper);

    scene.add(target);
    targets.push({ target, boundingBox, helper });
}

// Create Multiple Targets
createTarget(new THREE.Vector3(2, 2, 0));
createTarget(new THREE.Vector3(-2, 3, 0));
createTarget(new THREE.Vector3(0, 4, 0));

// Shoot a Bullet
function shootBullet() {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

    // Position the bullet at the ship's position
    bullet.position.set(ship.position.x, ship.position.y + 1, ship.position.z);

    // Initialize bounding box
    const boundingBox = new THREE.Box3().setFromObject(bullet);

    // Create BoxHelper and toggle visibility based on DEBUG_MODE
    const helper = new THREE.BoxHelper(bullet, 0x0000ff); // Blue box for bullet
    helper.material.visible = DEBUG_MODE;
    scene.add(helper);

    scene.add(bullet);
    bullets.push({ bullet, boundingBox, helper });
}

// Handle Collision Detection
function checkCollisions() {
    bullets.forEach((bulletObj, bulletIndex) => {
        const { bullet, boundingBox: bulletBoundingBox, helper: bulletHelper } = bulletObj;
        bulletBoundingBox.setFromObject(bullet); // Update bounding box
        bulletHelper.update(); // Update visual helper

        targets.forEach((targetObj, targetIndex) => {
            const { target, boundingBox: targetBoundingBox, helper: targetHelper } = targetObj;
            targetBoundingBox.setFromObject(target); // Update bounding box
            targetHelper.update(); // Update visual helper

            if (bulletBoundingBox.intersectsBox(targetBoundingBox)) {
                console.log('Collision detected!');

                // Handle collision: Remove objects
                scene.remove(bullet);
                scene.remove(bulletHelper);
                bullets.splice(bulletIndex, 1);

                // scene.remove(target);
                // scene.remove(targetHelper);
                // targets.splice(targetIndex, 1);

                // Change target's colour
                target.material.color.set(`#${Math.floor(Math.random() * 0xffffff)
                                        .toString(16)
                                        .padStart(6, '0')}`);

                // // Revert colour after 500ms
                // setTimeout(() => {
                //     target.material.color.set(0x00ff00); // Revert to green
                // }, 500);

                // Update Score
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
            }
        });
    });
}

// Update Bullets
function updateBullets() {
    const bulletSpeed = 0.2;

    bullets.forEach((bulletObj, index) => {
        const { bullet } = bulletObj;
        bullet.position.y += bulletSpeed;

        if (bullet.position.y > 10) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });
}

// Animate Targets
function animateTargets() {
    targets.forEach((targetObj) => {
        const { target } = targetObj;
        target.position.x += Math.sin(Date.now() * 0.001) * 0.01;
    });
}

// Ship Movement
const keys = {};
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

function moveShip() {
    const speed = 0.1;

    if (keys['ArrowLeft']) ship.position.x -= speed;
    if (keys['ArrowRight']) ship.position.x += speed;

    ship.position.x = THREE.MathUtils.clamp(ship.position.x, -10, 10);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    moveShip();
    updateBullets();
    animateTargets();
    checkCollisions();

    renderer.render(scene, camera);
}
animate();

// Fire bullets on spacebar press
window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        shootBullet();
    }
});

// Set Camera Position
camera.position.z = 10;