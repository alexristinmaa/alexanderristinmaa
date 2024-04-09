'use client'

import { useEffect, useRef } from 'react';
// style
import styles from './page.module.css';

// next

// other
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    containerRef.current?.appendChild(renderer.domElement);

    camera.position.z = 5;

    const loader = new GLTFLoader();

    (async () => {
      let donut = await new Promise((resolve, reject) => loader.load('/donuts.gltf', data => resolve(data), undefined, reject)) as GLTF;
      
      scene.add(donut.scene);
      // Render the scene and camera

      // Add this function inside the useEffect hook
      const renderScene = () => {
        donut.scene.rotation.x += 0.01;
        donut.scene.rotation.y += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
      };

      // Call the renderScene function to start the animation loop
      renderScene(0);
    })();
    

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup of the renderer element
      // Cleanup of the window element
      // Good article here: https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
      renderer.domElement.remove();
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div>
      <span className={styles.text} id={styles.thebox}>THE DONUT</span>
      <div ref={containerRef} />
    </div>
  );
}
