import React, { FC, useState, useEffect } from 'react'
import type { EntryData } from '@/lib/types'
import Clock from '@/components/clock'
import TableView from '@/components/table-view'
import { getNextWeek, getPrevWeek } from '@/lib/date-util'
import { postBody } from '@/lib/fetch-util'
import styles from '@/styles/App.module.css'

type AppProps = {
    userEmail: string
}

const App: FC<AppProps> = props => {
    const [visibleEntries, setVisibleEntries] = useState<Array<EntryData>>([])
    const [maxTime, setMaxTime] = useState<Date>(getNextWeek(new Date()))
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
        if (entries.length && !entries[entries.length - 1].clockIn) {
            entries.pop()
        }
        setVisibleEntries(entries)
    }

    useEffect(() => {
        getEntries()
    }, [])

    return (
        <section className={styles.wrap}>
            <Clock userEmail={props.userEmail} updateTimecard={getEntries} />
            <TableView entries={visibleEntries} />
        </section>
    )
}

export default App
