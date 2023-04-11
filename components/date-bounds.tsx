import React, { FC, useRef, useEffect } from 'react'
import { FaCaretRight } from 'react-icons/fa'
import { formatShort, getDayStart, getDayEnd } from '@/lib/date'
import Loader from '@/components/loader'
import styles from '@/styles/DateBounds.module.css'
import placeholder from '@/styles/Placeholder.module.css'

type DateBoundsProps = {
    min: Date,
    max: Date,
    setMin: (d: Date) => void,
    setMax: (d: Date) => void,
    loaded: boolean
}

const DateBounds: FC<DateBoundsProps> = props => {
    const setMin = (date: Date): void => {
        props.setMin(getDayStart(date))
    }

    const setMax = (date: Date): void => {
        props.setMax(getDayEnd(date))
    }

    return (
        <Loader
            loaded={props.loaded}
            placeholder={
                <div className={`${styles.placeholder} ${placeholder.style}`}>datein</div>
            }
            content={
                <div className={styles.wrap}>
                    <DateInput default={props.min} setValue={setMin} />
                    <FaCaretRight className={styles.arrow} />
                    <DateInput default={props.max} setValue={setMax} />
                </div>
            }
        />
    )
}

type DateInputProps = {
    default: Date,
    setValue: (d: Date) => void
}

const DateInput: FC<DateInputProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null)
    const lastValidRef = useRef<string>(formatShort(props.default))
    const revertTimerRef = useRef<number>(-1)

    const updateValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        // revert date to last valid entry after delay
        window.clearTimeout(revertTimerRef.current)
        revertTimerRef.current = window.setTimeout(revertInvalid, 3000)

        // capture day, month, year nums from string with regex
        const regex = /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})/
        const matches = e.target.value.match(regex)
        if (!matches || matches.length !== 4) {
            // stop update if date format is invalid
            return
        }
        const month = parseInt(matches[1])
        const day = parseInt(matches[2])
        if (month <= 0 || month > 12 || day <= 0 || day > 31) {
            // stop update if month or day is out of bounds
            return
        }
        let year = parseInt(matches[3])
        if (year < 100) { year += 2000 }
        const date = new Date(year, month - 1, day)
        lastValidRef.current = formatShort(date)
        props.setValue(date)
    }

    const revertInvalid = (): void => {
        if (inputRef.current) {
            inputRef.current.value = lastValidRef.current
        }
    }

    useEffect(() => {
        return () => window.clearTimeout(revertTimerRef.current)
    }, [])

    return (
        <input
            type="text"
            ref={inputRef}
            onInput={updateValue}
            defaultValue={lastValidRef.current}
        />
    )
}

export default DateBounds
