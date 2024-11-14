'use client';

// nextjs
import Link from 'next/link'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation'

import "../globals.css";
import styles from './layout.module.css';

const inter = Inter({ subsets: ["latin"] });
/* 
export const metadata: Metadata = {
  title: "Hemma",
  description: "Du är hemma",
};
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="sv">
      <body className={inter.className} id={styles.body}>
        <nav id={styles.nav}>
          <div id={styles.navLine}>
            <div className={styles.navLeft}>
              <Link href='/' id={styles.navTitle}>Alex Ställe</Link>
            </div>
            <div className={styles.navRight}>
              {/*<Link className={styles.navLink} href='/blog'><b>Bloggen</b></Link>*/}
              <Link className={`${styles.navLink} ${pathname == '/alex/'    ? styles.active : ''}`} href='/alex'>Vem är jag</Link>
              <Link className={`${styles.navLink} ${pathname == '/gallery/' ? styles.active : ''}`} href='/gallery'>Konsthall</Link>
            </div>
          </div>
        </nav>
        <main id={styles.main}>
        {children}
        </main>
        <footer id={styles.footer}>
          <span>Made with <Link href='/hemligt'><span className='icon heartIcon'></span></Link></span>
          <span>av Alexander Ristinmaa 2024</span>
        </footer>
      </body>
    </html>
  );
}
