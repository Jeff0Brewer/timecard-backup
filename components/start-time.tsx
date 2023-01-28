import React, { FC, useState, useRef, useEffect } from 'react'
import type { EntryData, CustomStart } from '@/lib/types'
import { getTimeString, getDateHours, getDateMinutes, getDateAmPm } from '@/lib/date-util'
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
            <p>Start time:</p>
            { props.lastEntry.clockIn
                ? <p>{getTimeString(props.lastEntry.date)}</p>
                : <div>
                    <input ref={hourRef} onInput={updateCustomStart} type="text" defaultValue={getDateHours(now)} />
                    <input ref={minuteRef} onInput={updateCustomStart} type="text" defaultValue={getDateMinutes(now)} />
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
        <a onClick={() => props.setValue(props.value === props.a ? props.b : props.a)}>
            {props.value}
        </a>
    )
}

export default StartTime
