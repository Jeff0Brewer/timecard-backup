import React, { FC, useState, useEffect } from 'react'
import { getTimeString, getDateString } from '@/lib/date-util'

type ClockInProps = {
    userId: string
}

const ClockIn: FC<ClockInProps> = props => {
    const [displayTime, setDisplayTime] = useState<Date>(new Date())

    useEffect(() => {
        const intervalId = setInterval(() => setDisplayTime(new Date()), 10000)
        return () => { window.clearInterval(intervalId) }
    }, [])

    return (
        <>
            <p>{getDateString(displayTime)}</p>
            <p>{getTimeString(displayTime)}</p>
        </>
    )
}

export default ClockIn
