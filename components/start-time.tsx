import React, { FC, useState } from 'react'
import type { EntryData } from '@/lib/types'
import { getTimeString, getDateHours, getDateMinutes, getDateAmPm } from '@/lib/date-util'
import styles from '@/styles/StartTime.module.css'

type StartTimeProps = {
    lastEntry: EntryData | null
}

const StartTime: FC<StartTimeProps> = props => {
    if (!props.lastEntry) return <></>

    return (
        <span className={styles.wrap}>
            <p>Start time:</p>
            { props.lastEntry.clockIn
                ? <p>{getTimeString(props.lastEntry.date)}</p>
                : <div>
                    <input type="text" defaultValue={getDateHours(props.lastEntry.date)} />
                    <input type="text" defaultValue={getDateMinutes(props.lastEntry.date)} />
                    <Toggle a="am" b="pm" />
                </div> }
        </span>
    )
}

type ToggleProps = {
    a: string,
    b: string
}

const Toggle: FC<ToggleProps> = props => {
    const [selected, setSelected] = useState<string>(props.a)

    return (
        <a onClick={() => setSelected(selected === props.a ? props.b : props.a)}>
            {selected}
        </a>
    )
}

export default StartTime
