import * as THREE from 'three';

export function createTarget(scene, targets, position, DEBUG_MODE) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const target = new THREE.Mesh(geometry, material);
    target.position.copy(position);

    const boundingBox = new THREE.Box3().setFromObject(target);
    const helper = new THREE.BoxHelper(target, 0xff0000);
    helper.material.visible = DEBUG_MODE;

    scene.add(target);
    scene.add(helper);

    targets.push({ target, boundingBox, helper, lastFired: null });
}

export function animateTargets(scene, targets, enemyBullets, enemyFireRate) {
    targets.forEach((targetObj) => {
        const { target, lastFired } = targetObj;

        // Make targets oscillate
        target.position.x += Math.sin(Date.now() * 0.001) * 0.01;

        // Each target fires one bullet every `enemyFireRate`
        const currentTime = Date.now();
        if (!lastFired || currentTime - lastFired > enemyFireRate) {
            const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
            bullet.position.copy(target.position); // Start from target's position
            scene.add(bullet);

            const boundingBox = new THREE.Box3().setFromObject(bullet);
            enemyBullets.push({ bullet, boundingBox });

            // Update last fired time for this target
            targetObj.lastFired = currentTime;
        }
    });

    // Move enemy bullets downward
    enemyBullets.forEach((bulletObj, index) => {
        const { bullet } = bulletObj;
        bullet.position.y -= 0.05; // Adjust speed as needed

        // Remove bullet if it moves off-screen
        if (bullet.position.y < -10) {
            scene.remove(bullet);
            enemyBullets.splice(index, 1);
        }
    });
}
