// nextjs
import Link from 'next/link'

// style
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
        <p>Hej. Jag heter Alexander Ristinmaa och detta är min hemsida. Om du vågar kolla runt kan du säkert hitta v<Link href='/hemligt'>a</Link>d du letar efter.</p>
    </div>
  );
}
