import * as THREE from 'three';

export function shootBullet(scene, bullets, ship, DEBUG_MODE) {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

    bullet.position.set(ship.position.x, ship.position.y + 1, ship.position.z);

    const boundingBox = new THREE.Box3().setFromObject(bullet);
    const helper = new THREE.BoxHelper(bullet, 0x0000ff);
    helper.material.visible = DEBUG_MODE;

    scene.add(helper);
    scene.add(bullet);
    bullets.push({ bullet, boundingBox, helper });
}

export function updateBullets(scene, bullets) {
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
