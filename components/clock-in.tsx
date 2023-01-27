import React, { FC, useState, useEffect } from 'react'
import { getTimeString, getDateString } from '@/lib/date-util'
import type { EntryData } from '@/lib/types'
import styles from '@/styles/ClockIn.module.css'

const postBody = (data: object) => {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
}

type ClockInProps = {
    userEmail: string
}

const ClockIn: FC<ClockInProps> = props => {
    const [displayTime, setDisplayTime] = useState<Date>(new Date())
    const [clockInState, setClockInState] = useState<boolean>(false)

    // check if user is currently clocked in
    const getClockInState = async () => {
        const res = await fetch('/api/get-clockin-state', postBody({ userEmail: props.userEmail }))
        const clockedIn = await res.json()
        setClockInState(clockedIn)
    }

    // clock in / out based on current clock state
    const clockIn = async () => {
        // track initial clock state to revert if request fails
        const initClockState = clockInState
        setClockInState(!initClockState)

        const entry: EntryData = {
            date: new Date(),
            clockIn: !initClockState,
            userEmail: props.userEmail
        }
        const res = await fetch('/api/add-entry', postBody(entry))

        // revert clock state on failure
        if (res.status !== 200) {
            const message = await res.json()
            console.log(message)
            setClockInState(!initClockState)
        }
    }

    useEffect(() => {
        getClockInState()
        const intervalId = setInterval(() => setDisplayTime(new Date()), 10000)
        return () => { window.clearInterval(intervalId) }
    }, [])

    return (
        <section className={styles.wrap}>
            <p className={styles.date}>{getDateString(displayTime)}</p>
            <p className={styles.time}>{getTimeString(displayTime)}</p>
            <button className={styles.clockIn} onClick={clockIn}>Clock {clockInState ? 'Out' : 'In'}</button>
        </section>
    )
}

export default ClockIn
