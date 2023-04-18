import React, { FC } from 'react'
import Loader from '@/components/loader'
import { EntryData } from '@/lib/types'
import { getTotalHours } from '@/lib/entry'
import { formatHours } from '@/lib/date'
import placeholder from '@/styles/Placeholder.module.css'

type TotalViewProps = {
    entries: Array<EntryData>
    loaded: boolean
}

const TotalView: FC<TotalViewProps> = props => {
    return (
        <Loader
            loaded={props.loaded}
            placeholder={
                <p className={placeholder.style}>total - {formatHours(0)}</p>
            }
            content={
                <p>total - {formatHours(getTotalHours(props.entries))}</p>
            }
        />
    )
}

export default TotalView
