import React, { FC, useState, ReactElement } from 'react'
import { RiDeleteBackFill } from 'react-icons/ri'
import type { EntryData } from '@/lib/types'
import { formatMed, formatTimeShort, formatHours, MS_TO_HR } from '@/lib/date'
import { splitJobs, getTotalHours } from '@/lib/entry'
import Loader from '@/components/loader'
import styles from '@/styles/TableView.module.css'
import placeholder from '@/styles/Placeholder.module.css'

type TableViewProps = {
    entries: Array<EntryData>
    deleteEntries: (ids: Array<string>) => void,
    loaded: boolean
}

const TableView: FC<TableViewProps> = props => {
    const getDayRows = (entries: Array<EntryData>): Array<ReactElement> => {
        const days = []
        for (let i = 0; i < entries.length; i += 2) {
            days.push(
                <DayRow
                    in={entries[i]}
                    out={entries[i + 1]}
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
                <div>{
                    Object.entries(splitJobs(props.entries)).map(([job, entries], i) =>
                        <section key={i}>
                            <span className={styles.top}>
                                <h3 className={styles.header}>{job}</h3>
                                <p className={styles.sum}>{
                                    formatHours(getTotalHours(entries))
                                }</p>
                            </span>
                            <div className={styles.table}>
                                {getDayRows(entries)}
                            </div>
                        </section>
                    )
                }</div>
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
    const hourDiff = formatHours(
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
                <p className={styles.day}>{formatMed(props.in.date)}</p>
                <p className={styles.in}>{formatTimeShort(props.in.date)}</p>
                <p className={styles.out}>{formatTimeShort(props.out.date)}</p>
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
