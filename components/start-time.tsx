import React, { FC, useRef, useEffect, useState } from 'react'
import type { EntryData } from '@/lib/types'
import { formatTime, fromHourMinuteAmPm } from '@/lib/date'
import styles from '@/styles/Clock.module.css'

type StartTimeProps = {
    lastEntry: EntryData | null,
    setCustomStart: (custom: Date) => void
}

const StartTime: FC<StartTimeProps> = props => {
    const [updateTime, setUpdateTime] = useState<boolean>(true)
    const inputRef = useRef<HTMLInputElement>(null)
    const lastValidRef = useRef<string>(formatTime(new Date()))
    const revertTimerRef = useRef<number>(-1)
    const updateIntervalRef = useRef<number>(-1)

    const updateCustomStart = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // revert start time to last valid entry after delay
        window.clearTimeout(revertTimerRef.current)
        revertTimerRef.current = window.setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.value = lastValidRef.current
            }
        }, 3000)

        // parse hour, minute, am/pm from text input
        const str = e.target.value.toLowerCase()
        const match = str.match(/(\d{1,2}):(\d{2}) ?([ap]m)/)
        if (!match || match.length !== 4) { return }
        const hour = parseInt(match[1])
        const minute = parseInt(match[2]) // trailing non-numeric chars ignored
        const ampm = match[3]

        // set date from matched values
        if (
            hour >= 0 && hour <= 12 &&
            minute >= 0 && minute <= 60
        ) {
            const custom = fromHourMinuteAmPm(hour, minute, ampm)
            lastValidRef.current = formatTime(custom)
            props.setCustomStart(custom)
            // stop start time updates since custom entered
            setUpdateTime(false)
        }
    }

    useEffect(() => {
        // clear revert timeout on unmount
        return () => {
            window.clearTimeout(revertTimerRef.current)
        }
    }, [])

    useEffect(() => {
        // update start time when last entry is clock out
        setUpdateTime(!props.lastEntry?.clockIn)
        // set input value to last entry time if clocked in
        if (props.lastEntry?.clockIn && inputRef.current) {
            inputRef.current.value = formatTime(props.lastEntry.date)
        }
    }, [props.lastEntry])

    useEffect(() => {
        if (!updateTime) { return }
        // immediately update start time to current
        if (inputRef.current) {
            inputRef.current.value = formatTime(new Date())
        }
        // start interval to update start time
        updateIntervalRef.current = window.setInterval(() => {
            // only update if input doesn't have focus
            if (inputRef.current && document.activeElement !== inputRef.current) {
                const time = formatTime(new Date())
                inputRef.current.value = time
                lastValidRef.current = time
            }
        }, 5000)
        return () => {
            window.clearInterval(updateIntervalRef.current)
        }
    }, [updateTime])

    return (
        <div className={`${styles.labeledInput} ${props.lastEntry?.clockIn ? styles.inactive : ''}`}>
            <label htmlFor="input">start time</label>
            <input
                id="input"
                ref={inputRef}
                type="text"
                defaultValue={lastValidRef.current}
                onInput={updateCustomStart}
            />
        </div>
    )
}

export default StartTime
