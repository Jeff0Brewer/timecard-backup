import React, { FC, useState } from 'react'
import { RiDeleteBack2Fill, RiDeleteBack2Line } from 'react-icons/ri'
import type { EntryData } from '@/lib/types'
import { hourFromMs, getTwoDigitMinutes, getDateString, getTimeString } from '@/lib/date-util'
import styles from '@/styles/TableView.module.css'

type TableViewProps = {
    entries: Array<EntryData>
    deleteEntries: (ids: Array<string>) => void
}

const TableView: FC<TableViewProps> = props => {
    const displayEntries = () => {
        // group entries into clock in/out pairs
        const entryPairs: Array<Array<EntryData>> = []
        props.entries.reduce((pairs, entry, i, entries) => {
            if (!entry.clockIn) { pairs.push([entries[i + 1], entries[i]]) }
            return pairs
        }, entryPairs)
        const dayDisplays = entryPairs.map((pair, i) =>
            <DayDisplay in={pair[0]} out={pair[1]} delete={props.deleteEntries} key={i} />
        )
        return (
            <div>
                {dayDisplays}
            </div>
        )
    }

    return (
        <>{ displayEntries() }</>
    )
}

type DayDisplayProps = {
    in: EntryData,
    out: EntryData,
    delete: (ids: Array<string>) => void
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
            >
                <RiDeleteBack2Line />
                <div className={styles.deleteHover}>
                    <RiDeleteBack2Fill />
                </div>
            </button>
        </span>
    )
}

export default TableView
