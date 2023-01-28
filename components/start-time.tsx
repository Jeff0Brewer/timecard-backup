import React, { FC, useState, useRef, useEffect } from 'react'
import type { EntryData, CustomStart } from '@/lib/types'
import { getTimeString, getDateHours, getDateAmPm, getTwoDigitMinutes } from '@/lib/date-util'
import styles from '@/styles/StartTime.module.css'

type StartTimeProps = {
    lastEntry: EntryData | null,
    setCustomStart: (custom: CustomStart) => void
}

const StartTime: FC<StartTimeProps> = props => {
    const now = new Date()
    const hourRef = useRef<HTMLInputElement>(null)
    const minuteRef = useRef<HTMLInputElement>(null)
    const [ampm, setAmpm] = useState<string>(getDateAmPm(now))

    const updateCustomStart = () => {
        if (!hourRef.current || !minuteRef.current) return
        const custom: CustomStart = {
            hour: parseInt(hourRef.current.value),
            minute: parseInt(minuteRef.current.value),
            ampm
        }
        props.setCustomStart(custom)
    }

    // call update in useEffect for ampm changes to ensure state updated prior
    useEffect(() => {
        updateCustomStart()
    }, [ampm])

    if (!props.lastEntry) return <></>
    return (
        <span className={styles.wrap}>
            <p>{props.lastEntry.clockIn ? 'started at' : 'start time:'}</p>
            { props.lastEntry.clockIn
                ? <p className={styles.startDisplay}>{getTimeString(props.lastEntry.date)}</p>
                : <div className={styles.startInput}>
                    <input
                        className={styles.hourInput}
                        ref={hourRef}
                        onInput={updateCustomStart}
                        defaultValue={getDateHours(now)}
                        type="text"
                    />
                    :
                    <input
                        ref={minuteRef}
                        onInput={updateCustomStart}
                        defaultValue={getTwoDigitMinutes(now.getMinutes())}
                        type="text"
                    />
                    <Toggle a="am" b="pm" value={ampm} setValue={v => setAmpm(v)} />
                </div> }
        </span>
    )
}

type ToggleProps = {
    a: string,
    b: string,
    value: string,
    setValue: (v: string) => void
}

const Toggle: FC<ToggleProps> = props => {
    return (
        <a className={styles.toggle} onClick={() => props.setValue(props.value === props.a ? props.b : props.a)}>
            {props.value}
        </a>
    )
}

export default StartTime
