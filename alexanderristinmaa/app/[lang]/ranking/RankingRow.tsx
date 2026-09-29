"use client";

import { LineChart } from '@derpdaderp/chartkit';

import { useState } from 'react';
import styles from './page.module.css'

export default function RankingRow({row, name, sendCount, data}: {row: number, name:string, sendCount: number, data: {count: number, date: string}[]}) {
    const [open, setOpen] = useState(false);
  
    let crownPicker = (i: number) => {
        let crowns = ['Gold', 'Silver', 'Bronze'];

        if(i < 3) return 'crown' + crowns[i];
        else return 'empty';
    }

    const collapse = () => {
        setOpen(!open);
    }

    return (
        <div className={styles.tableRow}>
            <div className={`${styles.tableValues} ${styles.collapseRow}`} onClick={() => collapse()}>
                <div><span className={`icon ${crownPicker(row)}`}></span><span>&nbsp;</span>{name}</div>
                <div className={styles.score}>{sendCount}</div>
            </div>
            <div className={`${styles.collapsible} ${open ? '' : styles.collapsed}`}>
                {data.length > 2 ? <LineChart
                    data={data} 
                    theme={'midnight'} 
                    responsive={true} 
                    curve='step'
                    timeKey='date'
                    series={[{key: 'count', label: 'Sends', area: true }]}
                    showLegend={false}
                ></LineChart> : "Not enough data"}
            </div>
        </div>
    )
}