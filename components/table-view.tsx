import React, { FC, useState } from 'react'
import { RiDeleteBackFill } from 'react-icons/ri'
import type { EntryData } from '@/lib/types'
import { getDateStringMed, getTimeStringShort, getHourString, MS_TO_HR } from '@/lib/date-util'
import styles from '@/styles/TableView.module.css'

type TableViewProps = {
    entries: Array<EntryData>
    deleteEntries: (ids: Array<string>) => void
}

const TableView: FC<TableViewProps> = props => {
    const getDayRows = () => {
        const days = []
        for (let i = 0; i < props.entries.length; i += 2) {
            days.push(
                <DayRow
                    in={props.entries[i]}
                    out={props.entries[i + 1]}
                    delete={props.deleteEntries}
                    key={i}
                />
            )
        }
        return days.reverse()
    }

    return (
        <section className={styles.wrap}>{
            getDayRows()
        }</section>
    )
}

type DayRowProps = {
    in: EntryData,
    out: EntryData,
    delete: (ids: Array<string>) => void
}

const DayRow: FC<DayRowProps> = props => {
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
    const hourDiff = getHourString(
        (props.out.date.getTime() - props.in.date.getTime()) * MS_TO_HR
    )

    const deleteSelf = () => {
        const ids = []
        if (props.in?.id) ids.push(props.in.id)
        if (props.out?.id) ids.push(props.out.id)
        props.delete(ids)
    }

    return (
        <span
            className={styles.row}
            onClick={() => setDeleteVisible(true)}
            onMouseEnter={() => setDeleteVisible(true)}
            onMouseLeave={() => setDeleteVisible(false)}
        >
            <div>
                <p className={styles.day}>{getDateStringMed(props.in.date)}</p>
                <p className={styles.in}>{getTimeStringShort(props.in.date)}</p>
                <p className={styles.out}>{getTimeStringShort(props.out.date)}</p>
            </div>
            <div>
                <p className={styles.total}>{hourDiff}</p>
                <button
                    className={`${styles.delete} ${deleteVisible ? styles.deleteVisible : ''}`}
                    onMouseDown={deleteSelf}
                >
                    <RiDeleteBackFill />
                </button>
            </div>
        </span>
    )
}

export default TableView
