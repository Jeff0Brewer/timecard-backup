import React, { FC, useState, useEffect } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import type { EntryData } from '@/lib/types'
import { getNextWeek, getPrevWeek } from '@/lib/date-util'
import { postBody } from '@/lib/fetch-util'
import ClockIn from '@/components/clock-in'
import DayDisplay from '@/components/day-display'
import DateInput from '@/components/date-input'
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
        // deleteEntries(entries.map(entry => entry?.id))
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
            <span
                className={`${styles.bounds} ${visibleEntries.length > 1 ? '' : styles.hidden}`}
            >
                <div className={styles.boundInput}>
                    <DateInput value={minTime} setValue={setMinTime} />
                    <div className={styles.boundArrow}><HiArrowNarrowRight /></div>
                    <DateInput value={maxTime} setValue={setMaxTime} />
                </div>
                <button className={styles.boundUpdate} onClick={getEntries}>update</button>
            </span>
            <div> { displayEntries() } </div>
        </section>
    )
}

export default Timecard
