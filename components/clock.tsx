import React, { FC, useState, useEffect } from 'react'
import type { EntryData, CustomStart } from '@/lib/types'
import { getDateStringLong, dateFromCustomStart } from '@/lib/date-util'
import { postBody, handleEntryResponse } from '@/lib/api'
import StartTime from '@/components/start-time'
import Loader from '@/components/loader'
import styles from '@/styles/Clock.module.css'
import placeholder from '@/styles/Placeholder.module.css'

type ClockInProps = {
    userEmail: string,
    updateTimecard: () => void
}

const ClockIn: FC<ClockInProps> = props => {
    const [displayTime, setDisplayTime] = useState<Date>(new Date())
    const [lastEntry, setLastEntry] = useState<EntryData | null>(null)
    const [customStart, setCustomStart] = useState<CustomStart | null>(null)

    const getLastEntry = async () => {
        const res = await fetch('/api/get-last-entry', postBody({ userEmail: props.userEmail }))
        const entries = await handleEntryResponse(res)
        setLastEntry(entries[0])
    }

    // clock in / out based on current clock state
    const clockIn = async () => {
        // prevent entry creation before state fetched
        if (!lastEntry) { return }

        let date: Date = new Date()
        // use custom start time if valid date provided
        if (!lastEntry.clockIn && customStart) {
            const customDate = dateFromCustomStart(customStart)
            if (customDate > date && customDate > lastEntry.date) {
                date = customDate
            }
        }
        // prevent clocking out before clock in time
        if (lastEntry.clockIn && date < lastEntry.date) {
            date = new Date(lastEntry.date.getTime() + 1)
        }

        const entry: EntryData = {
            date,
            clockIn: !lastEntry.clockIn,
            userEmail: props.userEmail
        }
        const res = await fetch('/api/add-entry', postBody(entry))
        const entries = await handleEntryResponse(res)
        setLastEntry(entries[0])
        setCustomStart(null)
        props.updateTimecard()
    }

    useEffect(() => {
        getLastEntry()
        const intervalId = window.setInterval(() => setDisplayTime(new Date()), 5000)
        return () => { window.clearInterval(intervalId) }
    }, [])

    return (
        <Loader loaded={!!lastEntry}
            placeholder={
                <section className={styles.wrap}>
                    <p className={`${placeholder.style} ${styles.datePlaceholder}`}>date</p>
                    <p className={`${placeholder.style} ${styles.startTimePlaceholder}`}>start</p>
                    <div className={`${placeholder.style} ${styles.clockInPlaceholder}`}>clockin</div>
                </section>
            }
            content={
                <section className={styles.wrap}>
                    <p className={styles.date}>{getDateStringLong(displayTime)}</p>
                    <StartTime lastEntry={lastEntry} setCustomStart={setCustomStart} />
                    <button className={styles.clockIn} onClick={clockIn}>Clock {lastEntry?.clockIn ? 'Out' : 'In'}</button>
                </section>
            }
        />
    )
}

export default ClockIn
