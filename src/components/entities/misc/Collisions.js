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
    resetGame,
    gameRunning,
    spawnWave,
    enemiesRemaining
) {
    bullets.forEach((bulletObj, bulletIndex) => {
        if (!bulletObj || !bulletObj.bullet) return;

        const { bullet, boundingBox: bulletBoundingBox, helper: bulletHelper } = bulletObj;
        bulletBoundingBox.setFromObject(bullet); // Ensure bounding box updates
        bulletHelper.update();

        targets.forEach((targetObj, targetIndex) => {
            if (!targetObj || !targetObj.target) return;

            const { target, boundingBox: targetBoundingBox, helper: targetHelper } = targetObj;
            targetBoundingBox.setFromObject(target); // Ensure bounding box updates
            targetHelper.update();

            if (bulletBoundingBox.intersectsBox(targetBoundingBox)) {
                console.log('Collision detected: Bullet hit target.');

                // Remove bullet from scene
                scene.remove(bullet);
                scene.remove(bulletHelper);
                bullets.splice(bulletIndex, 1);

                // Remove target from scene
                scene.remove(target);
                targets.splice(targetIndex, 1);

                // Ensure `enemiesRemaining--` happens correctly
                if (typeof enemiesRemaining !== 'undefined') {
                    enemiesRemaining--;
                }
                
                target.material.color.set(`#${Math.floor(Math.random() * 0xffffff)
                    .toString(16)
                    .padStart(6, '0')}`);

                // Update score
                score.value += 10;
                updateHUD(scoreElement, healthElement, score.value, health.value);

                // Check if all enemies are gone to trigger next wave
                if (enemiesRemaining <= 0) {
                    setTimeout(() => {
                        console.log(`All enemies defeated. Spawning next wave...`);
                        spawnWave(scene);
                    }, 2000);
                }
            }
        });
    });

    // Enemy bullet collisions with ship
    enemyBullets.forEach((bulletObj, bulletIndex) => {
        if (!bulletObj || !bulletObj.bullet) return;

        const { bullet, boundingBox: bulletBoundingBox } = bulletObj;
        bulletBoundingBox.setFromObject(bullet); // Update bounding box

        const shipBoundingBox = new THREE.Box3().setFromObject(ship);

        if (bulletBoundingBox.intersectsBox(shipBoundingBox)) {
            const currentTime = Date.now();

            // Add hit cooldown (500ms)
            if (currentTime - lastHitTime >= 500) {
                console.log('Player hit!');

                // Remove bullet from scene
                scene.remove(bullet);
                enemyBullets.splice(bulletIndex, 1);

                // Decrease health & update HUD
                health.value -= 1;
                updateHUD(scoreElement, healthElement, score.value, health.value);

                lastHitTime = currentTime; // Update last hit time

                // Check if player lost all health
                if (health.value <= 0) {
                    console.log('Game Over: Player health reached 0.');
                    gameOver(score.value, resetGame, gameRunning);
                }
            }
        }
    });

    return lastHitTime; // Return updated lastHitTime
}
