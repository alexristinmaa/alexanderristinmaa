// nextjs
import Link from 'next/link'

// style
import styles from './page.module.css';

// other
import * as fs from 'fs';
import parseMD from 'parse-md';

export default function Home() {
  let getExperiments = () => {
    return fs.readdirSync('./app/(experiments)', {withFileTypes: true})
            .filter(v => v.isDirectory() && fs.existsSync(`./app/(experiments)/${v.name}/page.md`))
            .map(v =>  ({data: fs.readFileSync(`./app/(experiments)/${v.name}/page.md`, 'utf8'), experiment: v.name}))
            .map(v => ({metadata: parseMD(v.data).metadata as any, experiment: v.experiment}));
  }
  

  return (
    <div id={styles.contentDiv}>
      <div>
        <p>Om du vågar kolla runt kan du säkert hitta vad du letar efter.</p><br />
        <p id={styles.experimentsTitle}><b>Mina senaste experiment:</b></p>
        <ul id={styles.experimentsList}>
          {
            getExperiments().map((v) => {
              return (
                <li key={v.metadata.name}>
                  <div className={styles.experimentTitle}>
                    <Link href={`/${v.experiment}`}><u>{v.metadata.name}</u></Link>
                    <Link href={`/${v.experiment}/info`}> (<u>info</u>)</Link>
                  </div>
                  
                  <Link href={`/${v.experiment}`}><p>{v.metadata.description}</p></Link>
                  
                </li>
              )
            })
          }
        </ul>
      </div>
        <div id={styles.imgDiv}>
          <img id ={styles.img} src="/keb.jpg" alt="Cool img" />
          <p><i>Kebnekaise toppstuga och en räddningshelikopter</i></p>
        </div>
        
    </div>
  );
}
