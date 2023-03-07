import React, { FC, useRef, useEffect } from 'react'
import type { EntryData, CustomStart } from '@/lib/types'
import { getTimeString, getTwoDigitMinutes } from '@/lib/date-util'
import styles from '@/styles/Clock.module.css'

type StartTimeProps = {
    lastEntry: EntryData,
    setCustomStart: (custom: CustomStart) => void
}

const StartTime: FC<StartTimeProps> = props => {
    return (
        <span className={styles.startTime}>{
            props.lastEntry.clockIn
                ? <p>started - {getTimeString(props.lastEntry.date)}</p>
                : <StartInput setCustomStart={props.setCustomStart} />
        }</span>
    )
}

type StartInputProps = {
    setCustomStart: (custom: CustomStart) => void
}

const StartInput: FC<StartInputProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null)
    const lastValidRef = useRef<string>(getTimeString(new Date()))
    const revertTimerRef = useRef<number>(-1)
    const updateIntervalRef = useRef<number>(-1)

    const updateCustomStart = (e: React.ChangeEvent<HTMLInputElement>) => {
        // revert start time to last valid entry after delay
        window.clearTimeout(revertTimerRef.current)
        revertTimerRef.current = window.setTimeout(revertInvalid, 3000)

        // parse hour, minute, am/pm from text input
        const str = e.target.value
        const match = str.match(/(\d{1,2}):(\d{2}) ?([ap]m)/)
        if (match && match.length === 4) {
            const hour = parseInt(match[1])
            const minute = parseInt(match[2]) // trailing non-numeric chars ignored
            const ampm = match[3]
            if (
                hour >= 0 && hour <= 12 &&
                minute >= 0 && minute <= 60
            ) {
                const custom: CustomStart = { hour, minute, ampm }
                lastValidRef.current = `${hour}:${getTwoDigitMinutes(minute)} ${ampm}`
                props.setCustomStart(custom)
                // stop start time value updates since custom entered
                window.clearInterval(updateIntervalRef.current)
            }
        }
    }

    const revertInvalid = () => {
        if (inputRef.current) {
            inputRef.current.value = lastValidRef.current
        }
    }

    useEffect(() => {
        // start interval to update start time value to curr time until custom entered
        updateIntervalRef.current = window.setInterval(() => {
            // only update if input element doesn't have focus
            if (inputRef.current && document.activeElement !== inputRef.current) {
                const time = getTimeString(new Date())
                inputRef.current.value = time
                lastValidRef.current = time
            }
        }, 5000)
        return () => {
            window.clearTimeout(revertTimerRef.current)
            window.clearInterval(updateIntervalRef.current)
        }
    }, [])

    return (
        <>
            <p>start time:</p>
            <input
                type="text"
                ref={inputRef}
                className={styles.startInput}
                onInput={updateCustomStart}
                defaultValue={lastValidRef.current}
            />
        </>
    )
}

export default StartTime
