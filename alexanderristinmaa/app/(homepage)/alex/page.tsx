// style
import styles from './page.module.css';

export default function Home() {
  return (
    <div id={styles.imgText}>
      <div id={styles.imgDiv}>
        <img id={styles.img} src='/alex/me.jpg'></img>
        <p><i>Jag i Fontainebleau, Frankrike. 2024</i></p>
      </div>
      <div id={styles.textDiv}>
        <p>Hejsan!</p>
        <p>Vad kul att du vill veta mer om mig :) 
          Det finns <u>säkerligen</u> en massa spännande saker som du undrar som jag tyvärr måste undanhålla dig i detta nu. 
          Detta är <b>inte</b> för att jag inte gillar dig! Det är helt enkelt för att jag är lat.
        </p>
        <p><b>Bra länkar:</b></p>
        <ul style={{listStyle: "none"}}>
          <li>Instagram: <a target="_blank" href="https://www.instagram.com/alexristinmaa/">@alexristinmaa</a></li>
          <li>27crags: <a target="_blank" href="https://27crags.com/climbers/alexanderris">alexanderris</a></li>
        </ul>
        
      </div>
    </div>

  );
}
