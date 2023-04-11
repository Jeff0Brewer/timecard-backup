import React, { FC, useState, ReactElement } from 'react'
import { RiDeleteBackFill } from 'react-icons/ri'
import type { EntryData } from '@/lib/types'
import { getDateStringMed, getTimeStringShort, getHourString, MS_TO_HR } from '@/lib/date-util'
import Loader from '@/components/loader'
import styles from '@/styles/TableView.module.css'
import placeholder from '@/styles/Placeholder.module.css'

type TableViewProps = {
    entries: Array<EntryData>
    deleteEntries: (ids: Array<string>) => void,
    loaded: boolean
}

const TableView: FC<TableViewProps> = props => {
    const getDayRows = (): Array<ReactElement> => {
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
        <Loader
            loaded={props.loaded}
            placeholder={
                <section className={`${styles.placeholder} ${placeholder.style}`}></section>
            }
            content={
                <section className={styles.wrap}>{
                    getDayRows()
                }</section>
            }
        />
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

    const deleteSelf = (): void => {
        const ids = []
        if (props.in?.id) ids.push(props.in.id)
        if (props.out?.id) ids.push(props.out.id)
        props.delete(ids)
    }

    return (
        <span
            className={styles.row}
            onClick={(): void => setDeleteVisible(true)}
            onMouseEnter={(): void => setDeleteVisible(true)}
            onMouseLeave={(): void => setDeleteVisible(false)}
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
