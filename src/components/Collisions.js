import * as THREE from 'three';

export function checkCollisions(
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
) {
    // Bullet collisions with targets
    bullets.forEach((bulletObj, bulletIndex) => {
        const { bullet, boundingBox: bulletBoundingBox, helper: bulletHelper } = bulletObj;
        bulletBoundingBox.setFromObject(bullet);
        bulletHelper.update();

        targets.forEach((targetObj, targetIndex) => {
            const { target, boundingBox: targetBoundingBox, helper: targetHelper } = targetObj;
            targetBoundingBox.setFromObject(target);
            targetHelper.update();

            if (bulletBoundingBox.intersectsBox(targetBoundingBox)) {
                // Remove bullet
                scene.remove(bullet);
                scene.remove(bulletHelper);
                bullets.splice(bulletIndex, 1);

                // Change target colour
                target.material.color.set(`#${Math.floor(Math.random() * 0xffffff)
                                        .toString(16)
                                        .padStart(6, '0')}`);

                // Increment score
                score.value += 10;
                updateHUD(scoreElement, healthElement, score.value, health.value); // Update HUD
            }
        });
    });

    // Enemy bullet collisions with ship
    enemyBullets.forEach((bulletObj, bulletIndex) => {
        const { bullet, boundingBox: bulletBoundingBox } = bulletObj;
        bulletBoundingBox.setFromObject(bullet);

        const shipBoundingBox = new THREE.Box3().setFromObject(ship);

        if (bulletBoundingBox.intersectsBox(shipBoundingBox)) {
            const currentTime = Date.now();

            // Add hit cooldown
            if (currentTime - lastHitTime >= 500) { // 500ms cooldown
                scene.remove(bullet);
                enemyBullets.splice(bulletIndex, 1);

                // Decrease health
                health.value -= 1;
                updateHUD(scoreElement, healthElement, score.value, health.value); // Update HUD

                lastHitTime = currentTime; // Update last hit time

                if (health.value <= 0) {
                    gameOver(score.value, resetGame);
                }
            }
        }
    });

    return lastHitTime; // Return updated lastHitTime
}
