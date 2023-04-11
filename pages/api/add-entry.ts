import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasEntry } from '@/lib/api'

const addEntry = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    // check current session and entry in request body
    if (!(await hasSession(req, res)) || !hasEntry(req, res)) { return }

    const entry: EntryData = await prisma.timeEntry.create({ data: req.body })
    res.status(200).json({ data: [entry] })
}

export default addEntry
