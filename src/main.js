import * as THREE from 'three';
import { createShip } from './components/Ship.js';
import { createTarget } from './components/Targets.js';
import { shootBullet, updateBullets } from './components/Bullets.js';

// Scene, Camera, Renderer Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 20, window.innerHeight - 32);
document.body.appendChild(renderer.domElement);

const DEBUG_MODE = false;
const bullets = [];
const targets = [];
let score = 0;

const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontSize = '20px';
scoreElement.textContent = `Score: ${score}`;
document.body.appendChild(scoreElement);

const ship = createShip(scene);
createTarget(scene, targets, new THREE.Vector3(2, 2, 0), DEBUG_MODE);
createTarget(scene, targets, new THREE.Vector3(-2, 3, 0), DEBUG_MODE);
createTarget(scene, targets, new THREE.Vector3(0, 4, 0), DEBUG_MODE);

function checkCollisions() {
    bullets.forEach((bulletObj, bulletIndex) => {
        const { bullet, boundingBox: bulletBoundingBox, helper: bulletHelper } = bulletObj;
        bulletBoundingBox.setFromObject(bullet);
        bulletHelper.update();

        targets.forEach((targetObj, targetIndex) => {
            const { target, boundingBox: targetBoundingBox, helper: targetHelper } = targetObj;
            targetBoundingBox.setFromObject(target);
            targetHelper.update();

            if (bulletBoundingBox.intersectsBox(targetBoundingBox)) {
                scene.remove(bullet);
                scene.remove(bulletHelper);
                bullets.splice(bulletIndex, 1);

                target.material.color.set(`#${Math.floor(Math.random() * 0xffffff)
                                        .toString(16)
                                        .padStart(6, '0')}`);
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
            }
        });
    });
}

const keys = {};
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

function moveShip() {
    const speed = 0.1;

    if (keys['ArrowLeft']) ship.position.x -= speed;
    if (keys['ArrowRight']) ship.position.x += speed;

    ship.position.x = THREE.MathUtils.clamp(ship.position.x, -10, 10);
}

function animateTargets() {
    targets.forEach((targetObj) => {
        const { target } = targetObj;
        target.position.x += Math.sin(Date.now() * 0.001) * 0.01;
    });
}

function animate() {
    requestAnimationFrame(animate);

    moveShip();
    updateBullets(scene, bullets);
    animateTargets();
    checkCollisions();

    renderer.render(scene, camera);
}
animate();

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        shootBullet(scene, bullets, ship, DEBUG_MODE);
    }
});

camera.position.z = 10;
