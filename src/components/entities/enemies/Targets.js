import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function oscillate(target, elapsedTime, amplitude = 2, speed = 0.5) {
    target.position.x = amplitude * Math.sin(elapsedTime * speed); 
    target.position.y -= speed * 0.01;
}

function zigzag(target, elapsedTime) {
    target.position.x += Math.sin(elapsedTime * 2) * 0.02;
    target.position.y += Math.cos(elapsedTime * 0.5) * 0.005;
}

function circular(target, elapsedTime) {
    const radius = 1;
    target.position.x = target.initialX + Math.cos(elapsedTime) * radius;
    target.position.y = target.initialY + Math.sin(elapsedTime) * radius;
}

export function createTarget(scene, targets, position, DEBUG_MODE, enemiesRemaining, updateUserProgress) {
    const loader = new GLTFLoader();
    // Use your glTF model file path here (make sure it's accessible)
    loader.load(
        '../../../../assets/entities/UFO.gltf', 
        (gltf) => {
            // gltf.scene is the scene graph of the loaded model
            const target = gltf.scene;
            
            // Adjust the scale if needed
            target.scale.set(0.3, 0.3, 0.3); // Adjust these values based on your model

            // Set initial position and store for movement patterns
            target.position.copy(position);
            target.initialX = position.x;
            target.initialY = position.y;

            target.rotation.x = Math.PI / 2;
            
            // Set a random movement pattern
            const movementPatterns = ['oscillate', 'circular', 'zigzag'];
            target.pattern = movementPatterns[Math.floor(Math.random() * movementPatterns.length)];
            target.isAlive = true;

            // Optionally, traverse the model's children and set their material if desired.
            // target.traverse(child => {
            //     if (child.isMesh) {
            //         child.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            //     }
            // });

            // Set up bounding box and debug helper
            const boundingBox = new THREE.Box3().setFromObject(target);
            const helper = new THREE.BoxHelper(target, 0xff0000);
            helper.material.visible = DEBUG_MODE;

            // Define the destroy callback to update progress and enemy count
            target.onDestroy = () => {
                if (target.isAlive) {
                    target.isAlive = false;
                    if (typeof enemiesRemaining.value !== 'undefined') {
                        enemiesRemaining.value--;
                        updateUserProgress();
                    }
                }
            };

            // Add the model and its helper to the scene and push it into the targets array
            scene.add(target);
            scene.add(helper);
            targets.push({ target, boundingBox, helper, lastFired: null });
        },
        undefined, // Optional progress callback
        (error) => {
            console.error('Error loading target model:', error);
        }
    );
}

// export function createTarget(scene, targets, position, DEBUG_MODE, enemiesRemaining, updateUserProgress) {
//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({ color: `#${Math.floor(Math.random() * 0xffffff)
//                                         .toString(16)
//                                         .padStart(6, '0')}` });
//     const target = new THREE.Mesh(geometry, material);

//     target.position.copy(position);
//     target.initialX = position.x;
//     target.initialY = position.y;

//     const boundingBox = new THREE.Box3().setFromObject(target);
//     const helper = new THREE.BoxHelper(target, 0xff0000);
//     helper.material.visible = DEBUG_MODE;

//     const movementPatterns = ['oscillate', 'circular', 'zigzag'];
//     target.pattern = movementPatterns[Math.floor(Math.random() * movementPatterns.length)];

//     target.isAlive = true;

//     target.onDestroy = () => {
//         if (target.isAlive) {
//             target.isAlive = false;
    
//             if (typeof enemiesRemaining.value !== 'undefined') {
//                 enemiesRemaining.value--; 
//                 updateUserProgress();
//                 // console.log(`Enemy removed. Remaining: ${enemiesRemaining.value}`);
//             }
//         }
//     };

//     scene.add(target);
//     scene.add(helper);
//     targets.push({ target, boundingBox, helper, lastFired: null });
// }

// Animation Patterns

export function animateTargets(scene, targets, enemyBullets) {
    const elapsedTime = Date.now() * 0.001;

    for (let i = targets.length - 1; i >= 0; i--) {
        const { target, lastFired, fireCooldown } = targets[i];

        switch (target.pattern) {
            case 'oscillate': oscillate(target, elapsedTime); break;
            case 'zigzag': zigzag(target, elapsedTime); break;
            case 'circular': circular(target, elapsedTime); break;
        }
        
        if (target.position.y < -10) {
            console.log("Enemy left the screen! Removing...");

            target.onDestroy();
            
            scene.remove(target);
            targets.splice(i, 1);
        }
    }
}
