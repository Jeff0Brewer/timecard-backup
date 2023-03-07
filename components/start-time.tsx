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
            }
        }
    }

    const revertInvalid = () => {
        if (inputRef.current) {
            inputRef.current.value = lastValidRef.current
        }
    }

    useEffect(() => {
        return () => window.clearTimeout(revertTimerRef.current)
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
