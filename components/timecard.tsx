import React, { FC, useState, useEffect } from 'react'
import { RiDeleteBack2Fill, RiDeleteBack2Line } from 'react-icons/ri'
import type { EntryData } from '@/lib/types'
import { getNextWeek, getPrevWeek, getDateString, getTimeString } from '@/lib/date-util'
import { postBody } from '@/lib/fetch-util'
import ClockIn from '@/components/clock-in'
import styles from '@/styles/Timecard.module.css'

type TimecardProps = {
    userEmail: string
}

const Timecard: FC<TimecardProps> = props => {
    const [visibleEntries, setVisibleEntries] = useState<Array<EntryData>>([])
    const [maxTime, setMaxTime] = useState<Date>(getNextWeek(new Date()))
    const [minTime, setMinTime] = useState<Date>(getPrevWeek(new Date()))

    const getEntries = async () => {
        const res = await fetch('/api/get-entries', postBody({
            userEmail: props.userEmail,
            minTime,
            maxTime
        }))
        const entries: Array<EntryData> = (await res.json()).map((entry: EntryData) => {
            entry.date = new Date(entry.date)
            return entry
        })
        // ensure oldest entry is clock-in instance
        if (entries.length && !entries[entries.length - 1].clockIn) {
            entries.pop()
        }
        setVisibleEntries(entries)
    }

    const deleteEntries = async (ids: Array<string | undefined>) => {
        ids = ids.filter(id => id)
        // remove entries on client for responsiveness
        setVisibleEntries(
            visibleEntries.filter(entry => (entry?.id && !ids.includes(entry.id)))
        )
        const res = await fetch('/api/delete-entries', postBody({ ids }))
        if (res.status !== 200) {
            getEntries() // revert client side deletion if db operation failed
            const { message } = await res.json()
            console.log(message)
        }
    }

    const displayEntries = () => {
        // group entries into clock in/out pairs
        const entryPairs: Array<Array<EntryData>> = []
        visibleEntries.reduce((pairs, entry, i, entries) => {
            if (!entry.clockIn) { pairs.push([entries[i + 1], entries[i]]) }
            return pairs
        }, entryPairs)
        return entryPairs.map((pair, i) =>
            <DayDisplay in={pair[0]} out={pair[1]} delete={deleteEntries} key={i} />
        )
    }

    useEffect(() => {
        getEntries()
    }, [])

    return (
        <section>
            <ClockIn userEmail={props.userEmail} updateTimecard={getEntries} />
            <div>
                <span className={styles.entryRow}>
                    <p className={styles.entryDay}>Day</p>
                    <p className={styles.entryIn}>In</p>
                    <p className={styles.entryOut}>Out</p>
                </span>
                { displayEntries() }
            </div>
        </section>
    )
}

type DayDisplayProps = {
    in: EntryData,
    out: EntryData,
    delete: (ids: Array<string | undefined>) => void
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
                onMouseDown={() => props.delete([props.in?.id, props.out?.id])}
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
