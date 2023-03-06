import React, { FC } from 'react'
import DayDisplay from '@/components/day-display'
import DateInput from '@/components/date-input'
import type { EntryData } from '@/lib/types'
import { postBody } from '@/lib/fetch-util'
import { hourFromMs, getTwoDigitMinutes } from '@/lib/date-util'
import styles from '@/styles/App.module.css'

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
        <>
            { displayEntries() }
        </>
    )
}

export default TableView
