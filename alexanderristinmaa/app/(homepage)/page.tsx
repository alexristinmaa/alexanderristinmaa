// nextjs
import Link from 'next/link'
import { metadata } from './layout';

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
        <p>Om du vågar kolla runt kan du säkert hitta v<Link href='/hemligt'>a</Link>d du letar efter.</p><br />
        <p id={styles.experimentsTitle}><b>Mina senaste experiment:</b></p>
        <ul id={styles.experimentsList}>
          {
            getExperiments().map((v) => {
              return (
                <Link href={`/${v.experiment}`}>
                  <li key={v.metadata.name}>
                    <p className={styles.experimentTitle}><u>{v.metadata.name}</u></p>
                    <p>{v.metadata.description}</p>
                  </li>
                </Link>
              )
            })
          }
        </ul>
      </div>
        <div id={styles.imgDiv}>
          <img id ={styles.img} src="/Alexander Ristinmaa.JPG" alt="Cool img" />
          <p><i>Kebnekaise toppstuga och en räddningshelikopter</i></p>
        </div>
        
    </div>
  );
}
