import React, { FC, useState, useEffect } from 'react'
import { RiDeleteBack2Fill, RiDeleteBack2Line } from 'react-icons/ri'
import type { EntryData } from '@/lib/types'
import { getPrevWeek, getDateString, getTimeString } from '@/lib/date-util'
import { postBody } from '@/lib/fetch-util'
import ClockIn from '@/components/clock-in'
import styles from '@/styles/Timecard.module.css'

type EntryPair = {
    in: EntryData,
    out: EntryData
}

type TimecardProps = {
    userEmail: string
}

const Timecard: FC<TimecardProps> = props => {
    const [visibleEntries, setVisibleEntries] = useState<Array<EntryPair>>([])
    const [maxTime, setMaxTime] = useState<Date>(new Date())
    const [minTime, setMinTime] = useState<Date>(getPrevWeek(new Date()))

    const updateEntries = async () => {
        const res = await fetch('/api/get-entries', postBody({
            userEmail: props.userEmail,
            minTime,
            maxTime
        }))
        const entries: Array<EntryData> = (await res.json()).map((entry: EntryData) => {
            entry.date = new Date(entry.date)
            return entry
        })

        // conditionally remove last and first element to ensure
        // entries are clock in / clock out pairs
        if (entries[0].clockIn) { entries.shift() }
        if (!entries[entries.length - 1].clockIn) { entries.pop() }
        const entryPairs: Array<EntryPair> = []
        entries.reduce((out, _, i, arr) => {
            if (i % 2 === 0) {
                // reverse order since entries sorted in decending time
                out.push({
                    in: arr[i + 1],
                    out: arr[i]
                })
            }
            return out
        }, entryPairs)
        setVisibleEntries(entryPairs)
    }

    useEffect(() => {
        updateEntries()
    }, [])

    return (
        <section>
            <ClockIn userEmail={props.userEmail} />
            <div>
                <span className={styles.entryRow}>
                    <p className={styles.entryDay}>Day</p>
                    <p className={styles.entryIn}>In</p>
                    <p className={styles.entryOut}>Out</p>
                </span>{
                    visibleEntries.map((pair: EntryPair, i: number) =>
                        <DayDisplay in={pair.in} out={pair.out} key={i}/>
                    )
                }</div>
        </section>
    )
}

type DayDisplayProps = {
    in: EntryData,
    out: EntryData
}

const DayDisplay: FC<DayDisplayProps> = props => {
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false)

    return (
        <span
            className={styles.entryRow}
            onClick={() => setDeleteVisible(true)}
            onMouseEnter={() => setDeleteVisible(true)}
            onMouseLeave={() => setDeleteVisible(false)}
        >
            <p className={styles.entryDay}>{getDateString(props.in.date)}</p>
            <p className={styles.entryIn}>{getTimeString(props.in.date)}</p>
            <p className={styles.entryOut}>{getTimeString(props.out.date)}</p>
            <button
                className={`${styles.entryDelete} ${deleteVisible ? styles.entryDeleteVisible : ''}`}
            >
                <RiDeleteBack2Line />
                <div className={styles.entryDeleteHover}>
                    <RiDeleteBack2Fill />
                </div>
            </button>
        </span>
    )
}

export default Timecard
