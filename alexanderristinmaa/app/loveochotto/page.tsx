'use client';

import styles from './page.module.css';

export default function Home() {
    let korBil = () => {
        let bil = document.getElementById(styles.bil);

        let count = 0;
        
        let animate = () => {
            bil!.style.left = count + "px";
            count++;
            requestAnimationFrame(animate);
        }

        animate();
    }
    return (
        <div>
            <p>Love bil</p>
            <button onClick={korBil}>KÖR BARA KÖR</button>
            <img id={styles.bil} src="/bil.png" alt="bil" />
        </div>
    );
}
