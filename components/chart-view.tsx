import React, { FC, useState, useEffect } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
import { Chart, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { EntryData } from '@/lib/types'
import { splitJobs } from '@/lib/entry'
import { formatShort, MS_TO_HR, MS_PER_DAY } from '@/lib/date'
import Loader from '@/components/loader'
import styles from '@/styles/ChartView.module.css'
import placeholder from '@/styles/Placeholder.module.css'

type ChartViewProps = {
    entries: Array<EntryData>,
    minTime: Date,
    maxTime: Date,
    loaded: boolean
}

const ChartView: FC<ChartViewProps> = props => {
    const [data, setData] = useState<ChartData<'line'>>({ datasets: [] })

    // get list of date strings for days in date range
    const getDayList = (min: Date, max: Date): Array<string> => {
        const days = []
        const minMs = min.getTime()
        const maxMs = max.getTime()
        for (let t = minMs; t < maxMs; t += MS_PER_DAY) {
            days.push(formatShort(new Date(t)))
        }
        return days
    }

    const getDayTotals = (days: Array<string>, entries: Array<EntryData>): Array<number> => {
        // make map from date string to hours to bin entries into single days
        const data: { [day: string]: number } = {}
        days.forEach(day => { data[day] = 0 })
        // iterate through pairs, adding total to entry's date bin
        for (let i = 0; i < entries.length; i += 2) {
            const day = formatShort(entries[i].date)
            const t0 = entries[i].date.getTime()
            const t1 = entries[i + 1].date.getTime()
            data[day] += (t1 - t0) * MS_TO_HR
        }
        return Object.values(data)
    }

    // set chart data on change to entries prop
    useEffect(() => {
        const days = getDayList(props.minTime, props.maxTime)
        const data: { [job: string]: Array<number> } = {}
        Object.entries(splitJobs(props.entries)).forEach(([job, entries]) => {
            data[job] = getDayTotals(days, entries)
        })
        setData({
            labels: days,
            datasets: Object.entries(data).map(([job, hours], i) => {
                const color = JOB_COLORS[i % JOB_COLORS.length]
                return {
                    label: job,
                    data: hours,
                    borderColor: color,
                    backgroundColor: color,
                    tension: 0.3
                }
            })
        })
    }, [props.entries])

    return (
        <Loader
            loaded={props.loaded}
            placeholder={
                <section className={`${placeholder.style} ${styles.placeholder}`}></section>
            }
            content={
                <section className={styles.wrap}>
                    <Line data={data} options={options} />
                </section>
            }
        />
    )
}

const JOB_COLORS = [
    '#ffcb68',
    '#9257e3',
    '#447f73',
    '#f00',
    '#0f0',
    '#00f'
]

Chart.register(CategoryScale, LinearScale, LineElement, PointElement)
Chart.defaults.color = '#fff'

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        point: {
            radius: 3
        }
    },
    scales: {
        y: {
            ticks: {
                stepSize: 1
            },
            grid: {
                color: '#333'
            },
            border: {
                display: false
            }
        },
        x: {
            display: false
        }
    }
}

export default ChartView
