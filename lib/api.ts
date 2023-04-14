import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { EntryData, EntryResponse, JobData, JobResponse } from '@/lib/types'

const hasSession = async (req: NextApiRequest, res: NextApiResponse): Promise<boolean> => {
    const session = await getSession({ req })
    if (!session) {
        res.status(401).json({ message: 'Unauthorized request' })
        return false
    }
    return true
}

const hasFields = <T>(req: NextApiRequest, res: NextApiResponse): boolean => {
    if (!(req as any satisfies T)) {
        res.status(405).json({ message: 'Invalid request content' })
        return false
    }
    return true
}

type PostBody = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: string
}

const postBody = (data: object): PostBody => {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
}

// get data from response, log error messages
const checkResponseError = async (res: Response): Promise<any> => {
    const data = await res.json()
    if (!res.ok) {
        const message = 'message' in data ? data.message : 'failed'
        throw new Error(`Error ${res.status}: ${message}`)
    }
    return data
}

const handleEntryResponse = async (res: Response): Promise<Array<EntryData>> => {
    const entryResponse: EntryResponse = await checkResponseError(res)
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

const handleJobResponse = async (res: Response): Promise<Array<JobData>> => {
    const jobResponse: JobResponse = await checkResponseError(res)
    if ('message' in jobResponse) {
        return []
    }
    return jobResponse.data
}

export {
    hasSession,
    hasFields,
    handleEntryResponse,
    handleJobResponse,
    postBody
}
