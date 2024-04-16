---
name: The (3D) Donut
description: A little spinning 3d donut made with three.js
tags: 
    - three.js
    - 3d
---
# THE (3D) DONUT

This amazing viewer-experience shows a (SPINNING) model of a 3D donut using three.js with some encouraging music. 

## How does it work?
Using three.js and a 3d object stored in a .gltf file it is no problem loading and displaying it.

The setup is **identical** to the [three.js startup docs](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene).
```typescript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
```

*then* adding the **donut** to the scene using the builtin GLTFLoader.
```typescript
const loader = new GLTFLoader();
const donut = ... => loader.load('/donuts.gltf', ...);
scene.add(donut.scene);
```

Animating the donut is as simple as creating a function which calls `renderer.render(scene, camera)` and then requests an animation frame for itself. In between these, update the donut's rotation.
```typescript
const renderScene = () => {
    requestAnimationFrame(renderScene);

    donut.scene.rotation.x += 0.01;
    donut.scene.rotation.y += 0.01;

    renderer.render(scene, camera);
};

renderScene();
```


# Credit
This work is based on "DONUTS" (https://sketchfab.com/3d-models/donuts-1710b0f3f44d429ea7b41114f3ce0a09) by jun_sketchsoft (https://sketchfab.com/jun_sketchsoft) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

Music by Bensound.com
License code: RZYLPS60JH8KEXM5