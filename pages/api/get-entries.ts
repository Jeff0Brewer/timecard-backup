import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import { Prisma } from '@prisma/client'
import prisma from '@/prisma/client'
import { hasSession, hasEmail } from '@/lib/api'

const getEntries = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    // check current session and email in request body
    if (!(await hasSession(req, res)) || !hasEmail(req, res)) { return }

    const query: Prisma.TimeEntryFindManyArgs = {
        where: { userEmail: req.body.userEmail },
        orderBy: { date: 'asc' }
    }
    if (typeof req.body?.minTime === 'string' && typeof req.body?.maxTime === 'string') {
        query.where = {
            ...query.where,
            date: {
                lte: req.body.maxTime,
                gte: req.body.minTime
            }
        }
    }
    const entries: Array<EntryData> = await prisma.timeEntry?.findMany(query)
    res.status(200).json({ data: entries })
}

export default getEntries
