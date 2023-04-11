import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import { newEntryData } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, isPost, hasEmail } from '@/lib/api'

const getLastEntry = async (
    req: NextApiRequest,
    res: NextApiResponse<EntryResponse>
): Promise<void> => {
    if (!(await hasSession(req, res))) {
        // require current session
        return
    }
    if (!isPost(req, res) || !hasEmail(req, res)) {
        // require post request with email field
        return
    }

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
