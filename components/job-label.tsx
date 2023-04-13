import React, { FC, useRef } from 'react'
import type { EntryData } from '@/lib/types'
import styles from '@/styles/Clock.module.css'

type JobLabelProps = {
    lastEntry: EntryData | null,
    setJobLabel: (label: string) => void
}

const JobLabel: FC<JobLabelProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <span className={styles.jobLabel}>
            <p>job:</p>
            <input
                type="text"
                placeholder={'none'}
                ref={inputRef}
                defaultValue={props.lastEntry?.jobLabel}
            />
        </span>
    )
}

export default JobLabel
