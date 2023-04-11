import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, isPost, hasEmail, hasTimeBounds } from '@/lib/api'

const getEntries = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    if (!(await hasSession(req, res))) {
        // require current session
        return
    }
    if (!isPost(req, res) || !hasEmail(req, res) || !hasTimeBounds(req, res)) {
        // require post request with email and time bound fields
        return
    }
    // get find entries and return
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
