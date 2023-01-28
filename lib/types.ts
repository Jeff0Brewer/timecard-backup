type EntryData = {
    date: Date,
    clockIn: boolean,
    userEmail: string,
    id: string
}

const isEntryData = (x: any) => {
    return (
        // allow dates as Date obj or string for json compatibility
        (x?.date instanceof Date || typeof x?.date === 'string') &&
        typeof x?.clockIn === 'boolean' &&
        typeof x?.userEmail === 'string'
        // don't check id in case entry hasn't been added to db yet
    )
}

export {
    isEntryData
}

export type {
    EntryData
}
