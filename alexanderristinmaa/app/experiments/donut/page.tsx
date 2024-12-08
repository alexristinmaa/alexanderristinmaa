'use client'

import { createRef, useEffect, useRef, useState } from 'react';
// style
import styles from './page.module.css';

// next

// other
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = createRef<HTMLAudioElement>();
  let [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    const handleFirstPlay = (event : any) => {
      setHasPlayed(true);
      event.target.removeEventListener('timeupdate', handleFirstPlay);
    }

    audioRef.current?.addEventListener('timeupdate', handleFirstPlay);

    // THREEJS BUSINESS
    // LOAD AND RENDER DONUT

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    containerRef.current?.appendChild(renderer.domElement);

    camera.position.z = 5;

    const loader = new GLTFLoader();

    (async () => {
      const donut = await new Promise((resolve, reject) => loader.load('/donuts.gltf', data => resolve(data), undefined, reject)) as GLTF;
      
      scene.add(donut.scene);
      // Render the scene and camera

      // Add this function inside the useEffect hook
      const renderScene = () => {
        requestAnimationFrame(renderScene);
        
        donut.scene.rotation.x += 0.01;
        donut.scene.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      // Call the renderScene function to start the animation loop
      renderScene();
    })();

    return () => {
      // Cleanup of the renderer element
      // Cleanup of the window element
      // Good article here: https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
      
      renderer.domElement.remove();
      window.removeEventListener('resize', handleResize);
      audioRef.current?.removeEventListener('timeupdate', handleFirstPlay);
    }
  }, []);


  return (
    <div>
      {hasPlayed ? '' : <span className={styles.text} id={styles.enableAudio}>Please enable audio and refresh the page.</span>}
      <span className={styles.text} id={styles.thebox}>THE DONUT</span>
      <div ref={containerRef} />
      <audio src='/onrepeat.mp3' autoPlay hidden ref={audioRef}>
        If you're reading this, audio isn't supported. 
      </audio>
    </div>
  );
}
