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

const hasEmail = (req: NextApiRequest, res: NextApiResponse<EntryResponse>): boolean => {
    if (req.method !== 'POST' || typeof req.body?.userEmail !== 'string') {
        res.status(405).json({ message: 'Must send userEmail in POST body' })
        return false
    }
    return true
}

const hasEntry = (req: NextApiRequest, res: NextApiResponse<EntryResponse>): boolean => {
    if (req.method !== 'POST' || !isEntryData(req.body)) {
        res.status(405).json({ message: 'Must send entry in POST body' })
        return false
    }
    return true
}

const hasIds = (req: NextApiRequest, res: NextApiResponse<EntryResponse>): boolean => {
    if (req.method !== 'POST' || !Array.isArray(req.body?.ids)) {
        res.status(405).json({ message: 'Must send id array in POST body' })
        return false
    }
    return true
}

export {
    hasSession,
    hasEmail,
    hasEntry,
    hasIds
}
