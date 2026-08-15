// style
import styles from './page.module.css';

import rankingData from '../../../public/ranking/ranking.json'
import '/app/icons.css'

export default async function Home() {
  let crownPicker = (i: number) => {
    let crowns = ['Gold', 'Silver', 'Bronze'];

    if(i < 3) return 'crown' + crowns[i];
    else return 'empty';
  }

  const ranking = rankingData.filter(rank => rank.Score != 0)

  return <div className={styles.centerer}>
    <header>
      <h2>Kaosvägg Ranking</h2>
      <h3>Skånes Klätterklubb</h3>
    </header>
    <main>
      <table className={styles.rankingTable}>
        <thead>
          <tr className={styles.tableRow}>
            <th scope="col">Climber</th>
            <th scope="col" className={styles.score}>Sends</th>
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
      <p className={styles.info}>The ranking updates once per day, around midnight</p>
    </main>
  </div>
}