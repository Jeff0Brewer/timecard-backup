type EntryData = {
    date: Date,
    clockIn: boolean,
    userEmail: string,
    jobLabel?: string | null,
    id?: string
}

type JobData = {
    label: string,
    userEmail: string
}

type MessageResponse = { message: string }

type EntryResponse = { data: Array<EntryData> } | MessageResponse

type JobResponse = { data: Array<JobData> } | MessageResponse

const isEntryData = (x: any): boolean => {
    return (
        // allow dates as Date obj or string for json compatibility
        (x?.date instanceof Date || typeof x?.date === 'string') &&
        typeof x?.clockIn === 'boolean' &&
        typeof x?.userEmail === 'string'
    )
}

const newEntryData = (): EntryData => {
    return {
        date: new Date(),
        clockIn: false,
        userEmail: ''
    }
}

export {
    isEntryData,
    newEntryData
}

export type {
    EntryData,
    JobData,
    EntryResponse,
    JobResponse
}
