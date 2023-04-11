import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { EntryData, EntryResponse } from '@/lib/types'
import { isEntryData } from '@/lib/types'

const hasSession = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>): Promise<boolean> => {
    const session = await getSession({ req })
    if (!session) {
        res.status(401).json({ message: 'Unauthorized request' })
        return false
    }
    return true
}

const isPost = (req: NextApiRequest, res: NextApiResponse<EntryResponse>): boolean => {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Must use POST request' })
        return false
    }
    return true
}

const hasEmail = (req: NextApiRequest, res: NextApiResponse<EntryResponse>): boolean => {
    if (typeof req.body?.userEmail !== 'string') {
        res.status(405).json({ message: 'Must send user email' })
        return false
    }
    return true
}

const hasTimeBounds = (req: NextApiRequest, res: NextApiResponse<EntryResponse>): boolean => {
    if (typeof req.body?.minTime !== 'string' || typeof req.body?.maxTime !== 'string') {
        res.status(405).json({ message: 'Must send time bounds' })
        return false
    }
    return true
}

const hasEntry = (req: NextApiRequest, res: NextApiResponse<EntryResponse>): boolean => {
    if (!isEntryData(req.body)) {
        res.status(405).json({ message: 'Must send entry data' })
        return false
    }
    return true
}

const hasIds = (req: NextApiRequest, res: NextApiResponse<EntryResponse>): boolean => {
    if (!Array.isArray(req.body?.ids)) {
        res.status(405).json({ message: 'Must send id array' })
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
    hasSession,
    isPost,
    hasEmail,
    hasTimeBounds,
    hasEntry,
    hasIds,
    handleEntryResponse,
    postBody
}
