import React, { FC, useState, useEffect } from 'react'
import type { EntryData, CustomStart } from '@/lib/types'
import { newEntryData } from '@/lib/types'
import { getDateStringLong, dateFromCustomStart } from '@/lib/date-util'
import { postBody, getDateJson } from '@/lib/fetch-util'
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
        if (res.ok) {
            setLastEntry(await getDateJson(res))
        } else {
            const { message } = await res.json()
            console.log(message)
        }
    }

    // clock in / out based on current clock state
    const clockIn = async () => {
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
        setLastEntry(entry)
        const res = await fetch('/api/add-entry', postBody(entry))
        if (res.ok) {
            props.updateTimecard()
            setLastEntry(await getDateJson(res))
            setCustomStart(null)
        } else {
            const { message } = await res.json()
            console.log(message)
            getLastEntry() // revert clock state on failure
        }
    }

    useEffect(() => {
        getLastEntry()
        const intervalId = window.setInterval(() => setDisplayTime(new Date()), 1000)
        return () => { window.clearInterval(intervalId) }
    }, [])

    return (
        <section className={styles.wrap}>
            <p className={styles.date}>{getDateStringLong(displayTime)}</p>
            <StartTime lastEntry={lastEntry} setCustomStart={setCustomStart} />
            <button className={styles.clockIn} onClick={clockIn}>Clock {lastEntry.clockIn ? 'Out' : 'In'}</button>
        </section>
    )
}

export default ClockIn
