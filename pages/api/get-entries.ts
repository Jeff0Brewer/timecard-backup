import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import { Prisma } from '@prisma/client'
import prisma from '@/prisma/client'

const getEntries = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    if (req.method !== 'POST' || typeof req.body?.userEmail !== 'string') {
        res.status(405).json({ message: 'Must send user email in POST request' })
        return
    }
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
