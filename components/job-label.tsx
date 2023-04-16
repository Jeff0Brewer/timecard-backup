import React, { FC, useRef, useEffect } from 'react'
import type { EntryData, JobData } from '@/lib/types'
import { postBody, handleJobResponse } from '@/lib/api'
import styles from '@/styles/Clock.module.css'

type JobLabelProps = {
    lastEntry: EntryData | null,
    userEmail: string,
    setJobs: (jobs: Array<string>) => void,
    setJobLabel: (label: string) => void
}

const JobLabel: FC<JobLabelProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null)

    const updateLabel = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // substring label to ceil length
        const label = e.target.value.slice(0, 20)
        props.setJobLabel(label)
    }

    const getJobs = async (): Promise<void> => {
        const res = await fetch('/api/get-jobs', postBody({ userEmail: props.userEmail }))
        const jobs = await handleJobResponse(res)
        const jobLabels = jobs.map((job: JobData) => job.label)
        props.setJobs(jobLabels)
    }

    useEffect(() => {
        getJobs()
    }, [])

    // default to label of last entry
    useEffect(() => {
        if (props.lastEntry?.jobLabel) {
            props.setJobLabel(props.lastEntry.jobLabel)
            if (inputRef.current) {
                inputRef.current.value = props.lastEntry.jobLabel
            }
        }
    }, [props.lastEntry])

    // hide component when clocked in with no label
    if (props.lastEntry?.clockIn && !props.lastEntry?.jobLabel) {
        return <></>
    }

    return (
        <div className={styles.labeledInput}>
            <label>job name</label>
            <input
                type="text"
                placeholder={'none'}
                ref={inputRef}
                onInput={updateLabel}
            />
        </div>
    )
}

export default JobLabel
