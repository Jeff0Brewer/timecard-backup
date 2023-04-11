import { EntryData, EntryResponse } from '@/lib/types'

const postBody = (data: object) => {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
}

const handleEntryResponse = async (res: Response): Promise<Array<EntryData>> => {
    const entryResponse: EntryResponse = await res.json()
    // check and log errors
    if (!res.ok) {
        const message = 'message' in entryResponse
            ? entryResponse.message
            : 'failed'
        throw new Error(`Api Error ${res.status}: ${message}`)
    }
    // return empty list of entries if success and message
    if ('message' in entryResponse) {
        return []
    }
    // parse json string dates if entries returned
    return entryResponse.data.map((entry: EntryData) => {
        entry.date = new Date(entry.date)
        return entry
    })
}

export {
    postBody,
    handleEntryResponse
}
