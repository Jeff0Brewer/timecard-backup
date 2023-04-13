import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasFields } from '@/lib/api'

type GetEntriesRequest = {
    method: 'POST',
    body: {
        userEmail: string,
        minTime: string,
        maxTime: string
    }
}

const getEntries = async (
    req: NextApiRequest,
    res: NextApiResponse<EntryResponse>
): Promise<void> => {
    const authorized = await hasSession(req, res)
    const complete = hasFields<GetEntriesRequest>(req, res)
    if (!authorized || !complete) { return }

    // get entries and return
    const entries: Array<EntryData> = await prisma.timeEntry?.findMany({
        where: {
            userEmail: req.body.userEmail,
            date: {
                lte: req.body.maxTime,
                gte: req.body.minTime
            }
        },
        orderBy: { date: 'asc' }
    })
    res.status(200).json({ data: entries })
}

export default getEntries
