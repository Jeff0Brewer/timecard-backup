import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { EntryResponse } from '@/lib/types'
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

export {
    hasSession,
    isPost,
    hasEmail,
    hasTimeBounds,
    hasEntry,
    hasIds
}
