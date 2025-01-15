import * as THREE from 'three';

function oscillate(target, elapsedTime) {
    target.position.x += Math.sin(elapsedTime) * 0.01;
}

function zigzag(target, elapsedTime) {
    target.position.x += Math.sin(elapsedTime * 2) * 0.02;
    target.position.y += Math.cos(elapsedTime * 0.5) * 0.005;
}

function circular(target, elapsedTime) {
    const radius = 1; // Radius of the circle
    target.position.x = target.initialX + Math.cos(elapsedTime) * radius;
    target.position.y = target.initialY + Math.sin(elapsedTime) * radius;
}

export function createTarget(scene, targets, position, DEBUG_MODE, pattern) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const target = new THREE.Mesh(geometry, material);

    // Set the initial position and pattern
    target.position.copy(position);
    target.initialX = position.x;
    target.initialY = position.y;
    target.pattern = pattern;

    // Assign a random cooldown time (1 to 3 seconds)
    const fireCooldown = Math.random() * 2000 + 1000; // Random between 1000ms and 3000ms

    const boundingBox = new THREE.Box3().setFromObject(target);
    const helper = new THREE.BoxHelper(target, 0xff0000);
    helper.material.visible = DEBUG_MODE;

    scene.add(target);
    scene.add(helper);

    targets.push({ target, boundingBox, helper, lastFired: null, fireCooldown });
}

export function animateTargets(scene, targets, enemyBullets, enemyFireRate) {
    const elapsedTime = Date.now() * 0.001; // Convert to seconds for smoother movement

    targets.forEach((targetObj) => {
        const { target, lastFired, fireCooldown } = targetObj;

        // Apply movement based on the assigned pattern
        switch (target.pattern) {
            case 'oscillate':
                oscillate(target, elapsedTime);
                break;
            case 'zigzag':
                zigzag(target, elapsedTime);
                break;
            case 'circular':
                circular(target, elapsedTime);
                break;
            default:
                break;
        }

        // Fire bullets at random intervals
        const currentTime = Date.now();
        if (!lastFired || currentTime - lastFired > fireCooldown) {
            const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
            bullet.position.copy(target.position); // Start from target's position
            scene.add(bullet);

            const boundingBox = new THREE.Box3().setFromObject(bullet);
            enemyBullets.push({ bullet, boundingBox });

            // Reset the firing cooldown
            targetObj.lastFired = currentTime;
            targetObj.fireCooldown = Math.random() * 2000 + 1000; // Assign a new random cooldown
        }
    });

    // Move enemy bullets downward
    enemyBullets.forEach((bulletObj, index) => {
        const { bullet } = bulletObj;
        bullet.position.y -= 0.05;

        if (bullet.position.y < -10) {
            scene.remove(bullet);
            enemyBullets.splice(index, 1);
        }
    });
}