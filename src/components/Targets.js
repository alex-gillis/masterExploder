import * as THREE from 'three';

export function createTarget(scene, targets, position, DEBUG_MODE) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const target = new THREE.Mesh(geometry, material);
    target.position.copy(position);

    const boundingBox = new THREE.Box3().setFromObject(target);
    const helper = new THREE.BoxHelper(target, 0xff0000);
    helper.material.visible = DEBUG_MODE;

    scene.add(helper);
    scene.add(target);
    targets.push({ target, boundingBox, helper });
}
