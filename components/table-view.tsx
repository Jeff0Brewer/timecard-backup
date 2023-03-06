import React, { FC, useState } from 'react'
import { RiDeleteBack2Fill, RiDeleteBack2Line } from 'react-icons/ri'
import type { EntryData } from '@/lib/types'
import { postBody } from '@/lib/fetch-util'
import { hourFromMs, getTwoDigitMinutes, getDateString, getTimeString } from '@/lib/date-util'
import styles from '@/styles/TableView.module.css'

type TableViewProps = {
    entries: Array<EntryData>
}

const TableView: FC<TableViewProps> = props => {
    const deleteEntries = async (ids: Array<string | undefined>) => {
        ids = ids.filter(id => id)
        const res = await fetch('/api/delete-entries', postBody({ ids }))
        if (res.status !== 200) {
            const { message } = await res.json()
            console.log(message)
        }
    }

    const displayEntries = () => {
        // group entries into clock in/out pairs
        const entryPairs: Array<Array<EntryData>> = []
        props.entries.reduce((pairs, entry, i, entries) => {
            if (!entry.clockIn) { pairs.push([entries[i + 1], entries[i]]) }
            return pairs
        }, entryPairs)
        let hoursWorked = 0
        entryPairs.forEach(pair => {
            hoursWorked += hourFromMs(pair[1].date.getTime() - pair[0].date.getTime())
        })
        const minutesWorked = Math.floor((hoursWorked % 1) * 60)
        hoursWorked = Math.floor(hoursWorked)
        const dayDisplays = entryPairs.map((pair, i) =>
            <DayDisplay in={pair[0]} out={pair[1]} delete={deleteEntries} key={i} />
        )
        return (
            <div>
                {dayDisplays}
                {<p className={styles.totalHours}>
                    {`hours worked: ${hoursWorked}:${getTwoDigitMinutes(minutesWorked)}`}
                </p>}
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

export default TableView
