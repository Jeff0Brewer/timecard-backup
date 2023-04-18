import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasFields } from '@/lib/api'

type AddEntryRequest = {
    method: 'POST',
    body: {
        entry: EntryData
    }
}

const addEntry = async (
    req: NextApiRequest,
    res: NextApiResponse<EntryResponse>
): Promise<void> => {
    const authorized = await hasSession(req, res)
    const complete = hasFields<AddEntryRequest>(req, res)
    if (!authorized || !complete) { return }

    const entry: EntryData = await prisma.timeEntry.create({ data: req.body.entry })
    res.status(200).json({ data: [entry] })
}

export default addEntry
