import React, { FC, useRef, useEffect } from 'react'
import type { EntryData, CustomStart } from '@/lib/types'
import { formatTime, getTwoDigitMinutes } from '@/lib/date'
import styles from '@/styles/Clock.module.css'

type StartTimeProps = {
    lastEntry: EntryData | null,
    setCustomStart: (custom: CustomStart) => void
}

const StartTime: FC<StartTimeProps> = props => {
    return (
        <span className={styles.startTime}>{
            props.lastEntry?.clockIn
                ? <p>began: {formatTime(props.lastEntry.date)}</p>
                : <StartInput label={'start:'} setCustomStart={props.setCustomStart} />
        }</span>
    )
}

type StartInputProps = {
    label: string,
    setCustomStart: (custom: CustomStart) => void
}

const StartInput: FC<StartInputProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null)
    const lastValidRef = useRef<string>(formatTime(new Date()))
    const revertTimerRef = useRef<number>(-1)
    const updateIntervalRef = useRef<number>(-1)

    const updateCustomStart = (e: React.ChangeEvent<HTMLInputElement>): void => {
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

    const revertInvalid = (): void => {
        if (inputRef.current) {
            inputRef.current.value = lastValidRef.current
        }
    }

    useEffect(() => {
        // start interval to update start time value to curr time until custom entered
        updateIntervalRef.current = window.setInterval(() => {
            // only update if input element doesn't have focus
            if (inputRef.current && document.activeElement !== inputRef.current) {
                const time = formatTime(new Date())
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
            <p>{props.label}</p>
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
