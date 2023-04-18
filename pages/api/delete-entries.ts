import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasFields } from '@/lib/api'

type DeleteEntriesRequest = {
    method: 'POST',
    body: {
        ids: Array<string>
    }
}

const deleteEntries = async (
    req: NextApiRequest,
    res: NextApiResponse<EntryResponse>
): Promise<void> => {
    const authorized = await hasSession(req, res)
    const complete = hasFields<DeleteEntriesRequest>(req, res)
    if (!authorized || !complete) { return }

    const deleted = await prisma.timeEntry?.deleteMany({
        where: { id: { in: req.body.ids } }
    })
    if (deleted.count !== req.body.ids.length) {
        res.status(500).json({ message: `Deletion failed, ${deleted.count} entries deleted` })
        return
    }
    res.status(200).json({ message: 'Deletion successful' })
}

export default deleteEntries
