import React, { FC, useState } from 'react'
import { RiDeleteBack2Fill, RiDeleteBack2Line } from 'react-icons/ri'
import { getDateString, getTimeString } from '@/lib/date-util'
import type { EntryData } from '@/lib/types'
import styles from '@/styles/DayDisplay.module.css'

type DayDisplayProps = {
    in: EntryData,
    out: EntryData,
    delete: (ids: Array<string | undefined>) => void
}

const DayDisplay: FC<DayDisplayProps> = props => {
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false)

    return (
        <span
            className={styles.row}
            onClick={() => setDeleteVisible(true)}
            onMouseEnter={() => setDeleteVisible(true)}
            onMouseLeave={() => setDeleteVisible(false)}
        >
            <p className={styles.day}>{getDateString(props.in.date)}</p>
            <p className={styles.in}>{getTimeString(props.in.date)}</p>
            <p className={styles.out}>{getTimeString(props.out.date)}</p>
            <button
                className={`${styles.delete} ${deleteVisible ? styles.deleteVisible : ''}`}
                onMouseDown={() => props.delete([props.in?.id, props.out?.id])}
            >
                <RiDeleteBack2Line />
                <div className={styles.deleteHover}>
                    <RiDeleteBack2Fill />
                </div>
            </button>
        </span>
    )
}

export default DayDisplay
