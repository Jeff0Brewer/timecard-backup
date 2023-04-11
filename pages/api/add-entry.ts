import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, isPost, hasEntry } from '@/lib/api'

const addEntry = async (
    req: NextApiRequest,
    res: NextApiResponse<EntryResponse>
): Promise<void> => {
    if (!(await hasSession(req, res))) {
        // require current session
        return
    }
    if (!isPost(req, res) || !hasEntry(req, res)) {
        // require post request with entry data
        return
    }

    // create and return entry
    const entry: EntryData = await prisma.timeEntry.create({ data: req.body })
    res.status(200).json({ data: [entry] })
}

export default addEntry
