import React, { FC, useRef, useEffect, useState } from 'react'
import type { EntryData, JobData } from '@/lib/types'
import { postBody, handleJobResponse } from '@/lib/api'
import styles from '@/styles/Clock.module.css'

type JobLabelProps = {
    lastEntry: EntryData | null,
    userEmail: string,
    jobs: Array<string>,
    setJobs: (jobs: Array<string>) => void,
    setJobLabel: (label: string) => void
}

const JobLabel: FC<JobLabelProps> = props => {
    const [open, setOpen] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const getJobs = async (): Promise<void> => {
        const res = await fetch('/api/get-jobs', postBody({ userEmail: props.userEmail }))
        const jobs = await handleJobResponse(res)
        const jobLabels = jobs.map((job: JobData) => job.label)
        props.setJobs(jobLabels)
    }

    const closeOnBlur = (e: React.FocusEvent<HTMLDivElement>): void => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setOpen(false)
        }
    }

    const inputLabel = (e: React.ChangeEvent<HTMLInputElement>): void => {
        props.setJobLabel(e.target.value)
    }

    const selectLabel = (label: string): void => {
        props.setJobLabel(label)
        if (inputRef.current) {
            inputRef.current.value = label
        }
        setOpen(false)
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
        <div
            className={`${styles.labeledInput} ${props.lastEntry?.clockIn ? styles.inactive : ''}`}
            tabIndex={-1}
            onBlur={closeOnBlur}
        >
            <label>job title</label>
            <input
                type="text"
                placeholder={'Untitled'}
                ref={inputRef}
                onInput={inputLabel}
                onClick={(): void => { setOpen(true) }}
            />
            { !open || <div className={styles.dropWrap}>
                <div className={styles.dropList}>{
                    props.jobs.map((job: string, i: number) =>
                        <a
                            key={i}
                            onClick={(): void => { selectLabel(job) }}>
                            {job}
                        </a>
                    )
                }</div>
            </div>}
        </div>
    )
}

export default JobLabel
