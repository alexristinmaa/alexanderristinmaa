// nextjs
import Link from 'next/link'

// style
import styles from './page.module.css';

// other
import * as fs from 'fs';
import parseMD from 'parse-md';
import { getDictionary } from '../dictionaries';

export default async function Home({params} : {params: Promise<{lang: string}> }) {
  const experimentsPath = './app/experiments';

  const getExperiments = () => {
    return fs.readdirSync(experimentsPath, {withFileTypes: true})
            .filter(v => v.isDirectory() && fs.existsSync(`${experimentsPath}/${v.name}/page.md`))
            .map(v =>  ({data: fs.readFileSync(`${experimentsPath}/${v.name}/page.md`, 'utf8'), experiment: v.name}))
            .map(v => ({metadata: parseMD(v.data).metadata as any, experiment: v.experiment}));
  }

  const {lang} = await params;
  const dict = await getDictionary(lang);

  return (
    <div id={styles.contentDiv}>
      <div>
        <p>{dict.home.welcome}</p><br />
        <p id={styles.experimentsTitle}><b>{dict.home.experiments}</b></p>
        <ul id={styles.experimentsList}>
          {
            getExperiments().map((v) => {
              return (
                <li key={v.metadata.name}>
                  <div className={styles.experimentTitle}>
                    <Link href={`/experiments/${v.experiment}`}><u>{v.metadata.name}</u></Link>
                    <Link href={`/experiments/${v.experiment}/info`}> (<u>info</u>)</Link>
                  </div>
                  
                  <Link href={`/experiments/${v.experiment}`}><p>{v.metadata.description}</p></Link>
                  
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
