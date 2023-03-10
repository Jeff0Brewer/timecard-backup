import React, { FC, useState, useEffect } from 'react'
import type { EntryData } from '@/lib/types'
import { getHourString } from '@/lib/date-util'

type HourViewProps = {
    entries: Array<EntryData>
}

const HourView: FC<HourViewProps> = props => {
    const [total, setTotal] = useState<string>('0:00')

    useEffect(() => {
        let total = 0
        for (let i = 0; i < props.entries.length; i += 2) {
            const t1 = props.entries[i + 1].date.getTime()
            const t0 = props.entries[i].date.getTime()
            total += (t1 - t0) * MS_TO_HR
        }
        setTotal(getHourString(total))
    }, [props.entries])

    return (
        <p>total: {total}</p>
    )
}

const MS_TO_HR = 1 / 3600000

export default HourView
