// style
import styles from './page.module.css';

import rankingData from '../../../public/ranking/ranking.json'
import '/app/icons.css'

import { getDictionary } from '../dictionaries';

export default async function Home({params} : {params: Promise<{lang: string}> }) {
  const {lang} = await params;
  const dict = (await getDictionary(lang)).ranking;

  let crownPicker = (i: number) => {
    let crowns = ['Gold', 'Silver', 'Bronze'];

    if(i < 3) return 'crown' + crowns[i];
    else return 'empty';
  }

  const ranking = rankingData.filter(rank => rank.Score != 0)

  return <div className={styles.centerer}>
    <header>
      <h2>{dict.title}</h2>
      <h3>{dict.club}</h3>
    </header>
    <main>
      <table className={styles.rankingTable}>
        <thead>
          <tr className={styles.tableRow}>
            <th scope="col">{dict.climber}</th>
            <th scope="col" className={styles.score}>{dict.sends}</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((rank, i) => <tr className={styles.tableRow}>
            <td><span className={`icon ${crownPicker(i)}`}></span><span>&nbsp;</span>{rank.Name}</td>
            <td className={styles.score}>{rank.Score}</td>
          </tr>)}
        </tbody>
      </table>
      <br />
      <p className={styles.info}>{dict.info}</p>
    </main>
  </div>
}