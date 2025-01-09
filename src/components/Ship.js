import * as THREE from 'three';

export function createShip(scene) {
    const shipGeometry = new THREE.ConeGeometry(0.5, 1, 3);
    const shipMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ship = new THREE.Mesh(shipGeometry, shipMaterial);
    ship.position.set(0, -5, 0);
    scene.add(ship);

    return ship;
}
