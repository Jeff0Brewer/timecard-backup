import React, { FC, useState, useEffect } from 'react'
import type { EntryData } from '@/lib/types'
import Clock from '@/components/clock'
import DateBounds from '@/components/date-bounds'
import HourView from '@/components/hour-view'
import ChartView from '@/components/chart-view'
import TableView from '@/components/table-view'
import { getDayEnd, getPrevWeek } from '@/lib/date-util'
import { postBody } from '@/lib/fetch-util'
import styles from '@/styles/App.module.css'

type AppProps = {
    userEmail: string
}

const App: FC<AppProps> = props => {
    const [visibleEntries, setVisibleEntries] = useState<Array<EntryData>>([])
    const [maxTime, setMaxTime] = useState<Date>(getDayEnd(new Date()))
    const [minTime, setMinTime] = useState<Date>(getPrevWeek(new Date()))

    const getEntries = async () => {
        const res = await fetch('/api/get-entries', postBody({
            userEmail: props.userEmail,
            minTime,
            maxTime
        }))
        const entries: Array<EntryData> = (await res.json()).map((entry: EntryData) => {
            entry.date = new Date(entry.date)
            return entry
        })
        // ensure oldest entry is clock-in instance
        if (entries.length && !entries[0].clockIn) {
            entries.shift()
        }
        // ensure entries always have pair
        if (entries.length % 2 !== 0) {
            entries.pop()
        }
        setVisibleEntries(entries)
    }

    const deleteEntries = async (ids: Array<string>) => {
        const res = await fetch('/api/delete-entries', postBody({ ids }))
        if (res.status !== 200) {
            const { message } = await res.json()
            console.log(message)
        } else {
            // remove deleted entries from client
            const ids = await res.json()
            setVisibleEntries(visibleEntries.filter(x => !(x?.id && ids.includes(x.id))))
        }
    }

    useEffect(() => {
        getEntries()
    }, [minTime, maxTime])

    return (
        <div className={styles.wrap}>
            <Clock userEmail={props.userEmail} updateTimecard={getEntries} />
            <span className={styles.infoBar}>
                <DateBounds min={minTime} setMin={setMinTime} max={maxTime} setMax={setMaxTime} />
                <HourView entries={visibleEntries} />
            </span>
            <ChartView entries={visibleEntries} minTime={minTime} maxTime={maxTime} />
            <TableView entries={visibleEntries} deleteEntries={deleteEntries} />
        </div>
    )
}

export default App
