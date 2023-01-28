import React, { FC, useState, useEffect } from 'react'
import type { EntryData, CustomStart } from '@/lib/types'
import { newEntryData } from '@/lib/types'
import { getTimeString, getDateStringLong, dateFromCustomStart } from '@/lib/date-util'
import { postBody } from '@/lib/fetch-util'
import StartTime from '@/components/start-time'
import styles from '@/styles/ClockIn.module.css'

type ClockInProps = {
    userEmail: string,
    updateTimecard: () => void
}

const ClockIn: FC<ClockInProps> = props => {
    const [displayTime, setDisplayTime] = useState<Date>(new Date())
    const [lastEntry, setLastEntry] = useState<EntryData>(newEntryData())
    const [customStart, setCustomStart] = useState<CustomStart | null>(null)

    const getLastEntry = async () => {
        const res = await fetch('/api/get-last-entry', postBody({ userEmail: props.userEmail }))
        if (res.status === 200) {
            const entry = await res.json()
            entry.date = new Date(entry.date)
            setLastEntry(entry)
        } else {
            setLastEntry(newEntryData())
        }
    }

    // clock in / out based on current clock state
    const clockIn = async () => {
        // use custom start time if clocking in, custom is defined,
        // and custom is later than current time
        let date: Date = new Date()
        if (!lastEntry.clockIn && customStart) {
            const customDate = dateFromCustomStart(customStart)
            if (customDate > date) date = customDate
        }
        // ensure clock out is after clock in
        if (lastEntry.clockIn && date < lastEntry.date) {
            date = new Date(lastEntry.date.getTime() + 1)
        }
        const entry: EntryData = {
            date,
            clockIn: !lastEntry.clockIn,
            userEmail: props.userEmail
        }
        setLastEntry(entry)
        const res = await fetch('/api/add-entry', postBody(entry))
        if (res.status === 200) {
            props.updateTimecard()
            const entry = await res.json()
            entry.date = new Date(entry.date)
            setLastEntry(entry)
            setCustomStart(null)
        } else {
            getLastEntry() // revert clock state on failure
            const { message } = await res.json()
            console.log(message)
        }
    }

    useEffect(() => {
        getLastEntry()
        const intervalId = setInterval(() => setDisplayTime(new Date()), 10000)
        return () => { window.clearInterval(intervalId) }
    }, [])

    return (
        <section className={styles.wrap}>
            <p className={styles.date}>{getDateStringLong(displayTime)}</p>
            <p className={styles.time}>{getTimeString(displayTime)}</p>
            <StartTime lastEntry={lastEntry} setCustomStart={setCustomStart} />
            <button className={styles.clockIn} onClick={clockIn}>Clock {lastEntry.clockIn ? 'Out' : 'In'}</button>
        </section>
    )
}

export default ClockIn
