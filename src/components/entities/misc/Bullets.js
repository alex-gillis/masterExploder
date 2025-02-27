import * as THREE from 'three';

export function shootBullet(scene, bullets, ship, DEBUG_MODE) {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

    bullet.position.set(ship.position.x, ship.position.y + 1, ship.position.z);

    // Assign bounding box correctly & ensure updates each frame
    const boundingBox = new THREE.Box3().setFromObject(bullet);
    const helper = new THREE.BoxHelper(bullet, 0x0000ff);
    helper.material.visible = DEBUG_MODE;

    scene.add(helper);
    scene.add(bullet);
    bullets.push({ bullet, boundingBox, helper });
}

export function updateBullets(scene, bullets) {
    const bulletSpeed = 0.2;

    for (let i = bullets.length - 1; i >= 0; i--) {
        const { bullet, boundingBox, helper } = bullets[i];

        bullet.position.y += bulletSpeed;
        boundingBox.setFromObject(bullet); // Ensure bounding box updates with movement
        helper.update();

        if (bullet.position.y > 20) {
            scene.remove(bullet);
            scene.remove(helper);
            bullets.splice(i, 1);
        }
    }
}
