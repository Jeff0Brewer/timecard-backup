import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasIds } from '@/lib/api'

const deleteEntries = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    // check current session and id array in request body
    if (!(await hasSession(req, res)) || !hasIds(req, res)) { return }

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
