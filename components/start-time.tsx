import React, { FC } from 'react'
import type { EntryData } from '@/lib/types'
import { getTimeString } from '@/lib/date-util'
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
                : <input type="text" defaultValue={getTimeString(props.lastEntry.date)} /> }
        </span>
    )
}

export default StartTime
