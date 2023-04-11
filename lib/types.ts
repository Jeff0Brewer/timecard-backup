type CustomStart = {
    hour: number,
    minute: number,
    ampm: string
}

type EntryData = {
    date: Date,
    clockIn: boolean,
    userEmail: string,
    id?: string
}

type EntryResponse = { data: Array<EntryData> } | { message: string }

const isEntryData = (x: any) => {
    return (
        // allow dates as Date obj or string for json compatibility
        (x?.date instanceof Date || typeof x?.date === 'string') &&
        typeof x?.clockIn === 'boolean' &&
        typeof x?.userEmail === 'string'
    )
}

const newEntryData = () => {
    const entry: EntryData = {
        date: new Date(),
        clockIn: false,
        userEmail: ''
    }
    return entry
}

export {
    isEntryData,
    newEntryData
}

export type {
    EntryData,
    CustomStart,
    EntryResponse
}
