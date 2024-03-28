// nextjs
import Link from 'next/link'

// style
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      <nav id={styles.nav}>
        <div id={styles.navLine}>
          <div className={styles.navLeft}>
            <span id={styles.navTitle}>Alex Ställe</span>
          </div>
          <div className={styles.navRight}>
            <Link className={styles.navLink} href='/alex'>Vem e jag</Link>
            <Link className={styles.navLink} href='/varfor'>Varför e jag</Link>
          </div>
        </div>
      </nav>
      <main className={styles.main}>
        <p>Hej. Jag heter Alexander Ristinmaa och detta är min hemsida. Om du vågar kolla runt kan du säkert hitta en massa spännande grejor ;)</p>
      </main>
    </div>
  );
}
