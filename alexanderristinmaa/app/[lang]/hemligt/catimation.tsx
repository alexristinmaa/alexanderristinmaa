'use client';

import { useEffect, useState } from 'react';
import fcontent from './animationData';

import styles from './page.module.css';

export default function Catimation() {
    const [catimationState, setCatimation] = useState(fcontent[0]);
  
    let animator = (frame : number) => {
      setCatimation(fcontent[frame]);
      setTimeout(animator, 100, frame < fcontent.length-1 ? frame + 1 : 0);
    }
  
    useEffect(() => {
      animator(0);
    }, []);

    return <pre id={styles.catimator} dangerouslySetInnerHTML={{__html: catimationState }}></pre>;
}