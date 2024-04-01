// nextjs
import Link from 'next/link'

// style
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
        <p>Om du vågar kolla runt kan du säkert hitta v<Link href='/hemligt'>a</Link>d du letar efter.</p>
        <div id={styles.imgDiv}>
          <img id ={styles.img} src="/Alexander Ristinmaa.JPG" alt="Cool img" />
          <p>Kebnekaise toppstuga och en räddningshelikopter</p>
        </div>
        
    </div>
  );
}
