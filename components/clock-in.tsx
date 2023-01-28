import React, { FC, useState, useEffect } from 'react'
import type { EntryData } from '@/lib/types'
import { newEntryData } from '@/lib/types'
import { getTimeString, getDateStringLong } from '@/lib/date-util'
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
        const entry: EntryData = {
            date: new Date(),
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
            <StartTime lastEntry={lastEntry} />
            <button className={styles.clockIn} onClick={clockIn}>Clock {lastEntry.clockIn ? 'Out' : 'In'}</button>
        </section>
    )
}

export default ClockIn
