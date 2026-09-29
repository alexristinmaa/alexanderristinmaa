// style
import styles from './page.module.css';

import rankingData from '../../../public/ranking/ranking.json'
import '/app/icons.css'

import { getDictionary } from '../dictionaries';
import RankingRow from './RankingRow';

type RankingJSON = {
  Name: string,
  SendCount: number,
  Weeks: {
    [key: string]: {
      Count: number,
      Grades: string[]
    }
  }
}

type Ranking = {
  name: string,
  sendCount: number,
  data: Data[]
}

type Data = {
  date: string,
  count: number
}

function processRanking(ranking: RankingJSON): Ranking {
  // Format the weeks for the data

  // Sort weeks
  const sortedWeeks = Object.entries(ranking.Weeks).map(v => ({date: new Date(v[0]), count: v[1].Count})).sort((a,b)=>a.date.valueOf() - b.date.valueOf());
  let allWeeks = [] as Data[];
  // Now, make sure we have all weeks from the first to the last
  let lastWeek: Date = sortedWeeks[0].date;

  // Also make a cumulative sum of sends
  let sum = sortedWeeks[0].count;

  allWeeks.push({
    date: lastWeek.toLocaleDateString(),
    count: sum
  });

  for(let week of sortedWeeks.slice(1)) { 
    let thisWeek = new Date(lastWeek);
    thisWeek.setDate(thisWeek.getDate() + 7);

    while(week.date.valueOf() < thisWeek.valueOf()) {
      allWeeks.push({
        date: thisWeek.toLocaleDateString(),
        count: sum
      });

      thisWeek.setDate(thisWeek.getDate() + 7);
    }

    sum += week.count;

    allWeeks.push({
      date: week.date.toLocaleDateString(),
      count: sum
    })

    lastWeek = week.date;
  }

  return {
    name: ranking.Name,
    sendCount: ranking.SendCount,
    data: allWeeks
  }
}

export default async function Home({params} : {params: Promise<{lang: string}> }) {
  const {lang} = await params;
  const dict = (await getDictionary(lang)).ranking;

  // @ts-ignore
  const ranking = rankingData.map(processRanking);

  return <div className={styles.centerer}>
    <header>
      <h2>{dict.title}</h2>
      <h3>{dict.club}</h3>
    </header>
    <main>
      <div className={styles.rankingTable}>
        <div>
          <div className={`${styles.tableValues} ${styles.tableHeaders}`}>
            <div>{dict.climber}</div>
            <div className={styles.score}>{dict.sends}</div>
          </div>
        </div>
        <div>
          {ranking.map((rank, i) => <RankingRow row={i} name={rank.name} sendCount={rank.sendCount} data={rank.data} key={i}/>)}
        </div>
      </div>
      <br />
      <p className={styles.info}>{dict.info}</p>
    </main>
  </div>
}