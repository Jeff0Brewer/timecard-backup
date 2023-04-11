import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import { newEntryData } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasEmail } from '@/lib/api'

const getLastEntry = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    // check current session and email in request body
    if (!(await hasSession(req, res)) || !hasEmail(req, res)) { return }

    let entry: EntryData | null = await prisma.timeEntry?.findFirst({
        where: { userEmail: req.body.userEmail },
        orderBy: { date: 'desc' }
    })
    if (!entry) { entry = newEntryData() }
    res.status(200).json({ data: [entry] })
}

export default getLastEntry
