import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import { newEntryData } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasFields } from '@/lib/api'

type GetLastEntryRequest = {
    method: 'POST',
    body: {
        userEmail: string
    }
}

const getLastEntry = async (
    req: NextApiRequest,
    res: NextApiResponse<EntryResponse>
): Promise<void> => {
    const authorized = await hasSession(req, res)
    const complete = hasFields<GetLastEntryRequest>(req, res)
    if (!authorized || !complete) { return }

    // find last entry
    let entry: EntryData | null = await prisma.timeEntry?.findFirst({
        where: { userEmail: req.body.userEmail },
        orderBy: { date: 'desc' }
    })
    // return new entry if entries currently empty
    if (!entry) { entry = newEntryData() }
    res.status(200).json({ data: [entry] })
}

export default getLastEntry
