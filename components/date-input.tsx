import React, { FC, useRef } from 'react'
import { getDateMonth } from '@/lib/date-util'
import styles from '@/styles/DateInput.module.css'

type DateInputProps = {
    value: Date,
    setValue: (date: Date) => void
}

const DateInput: FC<DateInputProps> = props => {
    const monthRef = useRef<HTMLInputElement>(null)
    const dayRef = useRef<HTMLInputElement>(null)
    const yearRef = useRef<HTMLInputElement>(null)

    const update = () => {
        if (!monthRef.current || !dayRef.current || !yearRef.current) return
        const month = parseInt(monthRef.current.value) - 1
        const day = parseInt(dayRef.current.value)
        const year = parseInt(yearRef.current.value)
        if (
            month >= 0 && month <= 11 &&
            day >= 1 && day <= 31 &&
            year >= 2000 && year <= 3000
        ) {
            props.setValue(new Date(year, month, day))
        }
    }

    return (
        <span className={styles.wrap}>
            <input
                className={styles.inputSmall}
                ref={monthRef}
                onInput={update}
                defaultValue={getDateMonth(props.value)}
                type="text"
            />
            /
            <input
                className={styles.inputSmall}
                ref={dayRef}
                onInput={update}
                defaultValue={props.value.getDate()}
                type="text"
            />
            /
            <input
                className={styles.inputLarge}
                ref={yearRef}
                onInput={update}
                defaultValue={props.value.getFullYear()}
                type="text"
            />
        </span>
    )
}

export default DateInput
