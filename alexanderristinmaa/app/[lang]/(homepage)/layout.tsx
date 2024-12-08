// nextjs
import NavLink from "../../NavLink";
import Link from "next/link";

import { Inter } from "next/font/google";

import "../../globals.css";
import styles from './layout.module.css';
import { getDictionary } from '../dictionaries';

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: {lang: string}
}>) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return (
      <body className={inter.className} id={styles.body}>
        <nav id={styles.nav}>
          <div id={styles.navLine}>
            <div className={styles.navLeft}>
              <Link href={`/${lang}`} id={styles.navTitle}>{dict.title}</Link>
            </div>
            <div className={styles.navRight}>
              <NavLink className={styles.navLink} activeClassName={styles.active} href={`/${lang}/alex`}>{dict.about}</NavLink>
              <NavLink className={styles.navLink} activeClassName={styles.active} href={`/${lang}/gallery`}>{dict.gallery}</NavLink>
            </div>
          </div>
        </nav>
        <main id={styles.main}>
        {children}
        </main>
        <footer id={styles.footer}>
          <span>{dict.footer.made} <Link href={`/${lang}/hemligt`}><span className='icon heartIcon'></span></Link></span>
          <span>{dict.footer.by}</span>
        </footer>
      </body>
  );
}
