import React, { FC, useState, useEffect } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
import { Chart, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { EntryData } from '@/lib/types'
import { getDateStringShort } from '@/lib/date-util'
import styles from '@/styles/ChartView.module.css'

type ChartViewProps = {
    entries: Array<EntryData>,
    minTime: Date,
    maxTime: Date
}

const ChartView: FC<ChartViewProps> = props => {
    const [data, setData] = useState<ChartData<'line'>>({ datasets: [] })

    // set chart data on change to entries prop
    useEffect(() => {
        const data: {[id: string]: number} = {}
        // add date strings for current bounds as keys to data dict
        const minMs = props.minTime.getTime()
        const maxMs = props.maxTime.getTime()
        for (let t = minMs; t <= maxMs; t += MS_PER_DAY) {
            const date = getDateStringShort(new Date(t))
            data[date] = 0
        }
        // add total hours for each entry pair to data dict
        for (let i = props.entries.length - 1; i >= 0; i -= 2) {
            // use date of clock in as key
            const date = getDateStringShort(props.entries[i].date)
            const t0 = props.entries[i].date.getTime()
            const t1 = props.entries[i - 1].date.getTime()
            const hours = (t1 - t0) / MS_PER_HR
            data[date] += hours
        }
        setData({
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                borderColor: '#ffcb68',
                backgroundColor: '#fff',
                tension: 0.3
            }]
        })
    }, [props.entries])

    return (
        <section className={styles.wrap}>
            <Line data={data} options={options} />
        </section>
    )
}

Chart.register(CategoryScale, LinearScale, LineElement, PointElement)
Chart.defaults.color = '#fff'

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        point: {
            radius: 4
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

const MS_PER_HR = 3600000
const MS_PER_DAY = 86400000

export default ChartView
