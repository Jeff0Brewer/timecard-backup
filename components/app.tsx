import React, { FC, useState, useEffect } from 'react'
import type { EntryData } from '@/lib/types'
import Clock from '@/components/clock'
import DateBounds from '@/components/date-bounds'
import ChartView from '@/components/chart-view'
import TableView from '@/components/table-view'
import TotalView from '@/components/total-view'
import { getDayEnd, getPrevWeek } from '@/lib/date'
import { postBody, handleEntryResponse } from '@/lib/api'
import styles from '@/styles/App.module.css'

type AppProps = {
    userEmail: string
}

const App: FC<AppProps> = props => {
    const [entries, setEntries] = useState<Array<EntryData>>([])
    const [maxTime, setMaxTime] = useState<Date>(getDayEnd(new Date()))
    const [minTime, setMinTime] = useState<Date>(getPrevWeek(new Date()))
    const [loaded, setLoaded] = useState<boolean>(false)

    const getEntries = async (): Promise<void> => {
        const res = await fetch('/api/get-entries', postBody({
            userEmail: props.userEmail,
            minTime,
            maxTime
        }))
        const entries = await handleEntryResponse(res)
        // ensure oldest entry is clock-in instance
        if (entries.length && !entries[0].clockIn) {
            entries.shift()
        }
        // ensure entries always have pair
        if (entries.length % 2 !== 0) {
            entries.pop()
        }
        setEntries(entries)
        setLoaded(true)
    }

    const deleteEntries = async (ids: Array<string>): Promise<void> => {
        const res = await fetch('/api/delete-entries', postBody({ ids }))
        await handleEntryResponse(res) // no return value
        // remove deleted entries on success
        setEntries(entries.filter((entry) =>
            !(entry?.id && ids.includes(entry.id))
        ))
    }

    useEffect(() => {
        getEntries()
    }, [minTime, maxTime])

    return (
        <div className={styles.wrap}>
            <Clock
                userEmail={props.userEmail}
                updateTimecard={getEntries}
            />
            <span className={styles.infoBar}>
                <DateBounds
                    min={minTime}
                    setMin={setMinTime}
                    max={maxTime}
                    setMax={setMaxTime}
                    loaded={loaded}
                />
                <TotalView
                    entries={entries}
                    loaded={loaded}
                />
            </span>
            <ChartView
                entries={entries}
                minTime={minTime}
                maxTime={maxTime}
                loaded={loaded}
            />
            <TableView
                entries={entries}
                deleteEntries={deleteEntries}
                loaded={loaded}
            />
        </div>
    )
}

export default App
