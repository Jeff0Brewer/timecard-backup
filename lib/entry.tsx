import type { EntryData } from '@/lib/types'
import { MS_TO_HR } from '@/lib/date'

// split entry data into lists of single job
const splitJobs = (entries: Array<EntryData>): {[id: string]: Array<EntryData>} => {
    const jobs: {[id: string]: Array<EntryData>} = {}
    entries.forEach(entry => {
        const job = entry?.jobLabel ? entry.jobLabel : 'untitled'
        if (job in jobs) {
            jobs[job].push(entry)
        } else {
            jobs[job] = [entry]
        }
    })
    return jobs
}

// sum hours from list of entries
const getTotalHours = (entries: Array<EntryData>): number => {
    let total = 0
    // iterate through pairs of entries
    for (let i = 0; i < entries.length; i += 2) {
        const t0 = entries[i].date.getTime()
        const t1 = entries[i + 1].date.getTime()
        total += (t1 - t0) * MS_TO_HR
    }
    return total
}

export {
    splitJobs,
    getTotalHours
}
