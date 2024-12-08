import localFont from 'next/font/local'
 
// Font files can be colocated inside of `app`
const AvenirBlack = localFont({
  src: './fonts/Avenir_Black.otf',
  display: 'swap',
})

const AvenirRoman = localFont({
    src: './fonts/Avenir_Roman.otf',
    display: 'swap',
  })
 

// style
import Gallery from './gallery';
import styles from './page.module.css';

export default function Home() {
  return (
    <div id={styles.main} className={AvenirRoman.className}>
        <div id={styles.mainImage}>
            <div>
            </div>
        </div>
        <p id={styles.mainTitle} className={AvenirBlack.className}>Konsthallen</p>
        <div id={styles.rest}>
            <Gallery />
        </div>
    </div>
  );
}
