import React, { FC, useState, useEffect } from 'react'
import type { EntryData, JobData, CustomStart } from '@/lib/types'
import { formatLong, fromCustom } from '@/lib/date'
import { postBody, handleEntryResponse, handleJobResponse } from '@/lib/api'
import StartTime from '@/components/start-time'
import JobLabel from '@/components/job-label'
import Loader from '@/components/loader'
import styles from '@/styles/Clock.module.css'
import placeholder from '@/styles/Placeholder.module.css'

type ClockProps = {
    userEmail: string,
    updateTimecard: () => void
}

const Clock: FC<ClockProps> = props => {
    const [displayTime, setDisplayTime] = useState<Date>(new Date())
    const [lastEntry, setLastEntry] = useState<EntryData | null>(null)
    const [customStart, setCustomStart] = useState<CustomStart | null>(null)
    const [jobs, setJobs] = useState<Array<string>>([])
    const [jobLabel, setJobLabel] = useState<string>('')

    // clock in / out based on current clock state
    const clockIn = async (): Promise<void> => {
        // prevent entry creation before state fetched
        if (!lastEntry) { return }

        let date: Date = new Date()
        // use custom start time if valid date provided
        if (!lastEntry.clockIn && customStart) {
            const customDate = fromCustom(customStart)
            if (customDate > date && customDate > lastEntry.date) {
                date = customDate
            }
        }

        // prevent clocking out before clock in time
        if (lastEntry.clockIn && date < lastEntry.date) {
            date = new Date(lastEntry.date.getTime() + 1)
        }

        // create new job if label doesn't exist
        if (jobLabel && !jobs.includes(jobLabel)) {
            createJob({
                label: jobLabel,
                userEmail: props.userEmail
            })
        }

        // create new entry
        createEntry({
            date,
            jobLabel,
            clockIn: !lastEntry.clockIn,
            userEmail: props.userEmail
        })
    }

    const createJob = async (job: JobData): Promise<void> => {
        const res = await fetch('/api/add-job', postBody({ job }))
        const newJobs = await handleJobResponse(res)
        const label = newJobs[0].label
        setJobs([...jobs, label])
    }

    const createEntry = async (entry: EntryData): Promise<void> => {
        const res = await fetch('/api/add-entry', postBody({ entry }))
        const entries = await handleEntryResponse(res)
        setLastEntry(entries[0])
        setCustomStart(null)
        props.updateTimecard()
    }

    const getLastEntry = async (): Promise<void> => {
        const res = await fetch('/api/get-last-entry', postBody({ userEmail: props.userEmail }))
        const entries = await handleEntryResponse(res)
        setLastEntry(entries[0])
    }

    useEffect(() => {
        getLastEntry()
        const intervalId = window.setInterval(() => setDisplayTime(new Date()), 5000)
        return () => { window.clearInterval(intervalId) }
    }, [])

    return (
        <Loader
            loaded={!!lastEntry}
            placeholder={PLACEHOLDER}
            content={
                <section className={styles.wrap}>
                    <p className={styles.date}>{formatLong(displayTime)}</p>
                    <div className={styles.inputs}>
                        <JobLabel
                            lastEntry={lastEntry}
                            userEmail={props.userEmail}
                            setJobs={setJobs}
                            setJobLabel={setJobLabel}
                        />
                        <StartTime
                            lastEntry={lastEntry}
                            setCustomStart={setCustomStart}
                        />
                    </div>
                    <button className={styles.clockIn} onClick={clockIn}>
                        Clock {lastEntry?.clockIn ? 'Out' : 'In'}
                    </button>
                </section>
            }
        />
    )
}

const PLACEHOLDER = (
    <section className={styles.wrap}>
        <p className={`${placeholder.style} ${styles.datePlaceholder}`}>date</p>
        <div className={styles.inputs}>
            <div className={`${placeholder.style} ${styles.labeledInput}`}>
                <label>a</label>
                <input type="text" />
            </div>
            <div className={`${placeholder.style} ${styles.labeledInput}`}>
                <label>b</label>
                <input type="text" />
            </div>
        </div>
        <div className={`${placeholder.style} ${styles.clockInPlaceholder}`}>clockin</div>
    </section>
)

export default Clock
