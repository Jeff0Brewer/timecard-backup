import React, { FC, useState, useEffect } from 'react'
import type { EntryData } from '@/lib/types'
import { getTimeString, getDateStringLong } from '@/lib/date-util'
import { postBody } from '@/lib/fetch-util'
import styles from '@/styles/ClockIn.module.css'

type ClockInProps = {
    userEmail: string,
    updateTimecard: () => void
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
        const entry: EntryData = {
            date: new Date(),
            clockIn: !clockInState,
            userEmail: props.userEmail
        }
        setClockInState(!clockInState)
        const res = await fetch('/api/add-entry', postBody(entry))
        if (res.status !== 200) {
            getClockInState() // revert clock state on failure
            const { message } = await res.json()
            console.log(message)
        } else {
            props.updateTimecard()
        }
    }

    useEffect(() => {
        getClockInState()
        const intervalId = setInterval(() => setDisplayTime(new Date()), 10000)
        return () => { window.clearInterval(intervalId) }
    }, [])

    return (
        <section className={styles.wrap}>
            <p className={styles.date}>{getDateStringLong(displayTime)}</p>
            <p className={styles.time}>{getTimeString(displayTime)}</p>
            <button className={styles.clockIn} onClick={clockIn}>Clock {clockInState ? 'Out' : 'In'}</button>
        </section>
    )
}

export default ClockIn
