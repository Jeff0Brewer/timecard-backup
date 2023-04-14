import React, { FC, useRef, useEffect } from 'react'
import type { EntryData } from '@/lib/types'
import styles from '@/styles/Clock.module.css'

type JobLabelProps = {
    lastEntry: EntryData | null,
    setJobLabel: (label: string) => void
}

const JobLabel: FC<JobLabelProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null)

    const updateLabel = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // substring label to ceil length
        const label = e.target.value.slice(0, 20)
        props.setJobLabel(label)
    }

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
        <span className={styles.jobLabel}>{
            props.lastEntry?.clockIn
                ? <p>job: {props.lastEntry?.jobLabel}</p>
                : <>
                    <p>job:</p>
                    <input
                        type="text"
                        placeholder={'none'}
                        ref={inputRef}
                        onInput={updateLabel}
                    />
                </>
        }</span>
    )
}

export default JobLabel
