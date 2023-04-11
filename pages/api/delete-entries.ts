import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasIds, isPost } from '@/lib/api'

const deleteEntries = async (
    req: NextApiRequest,
    res: NextApiResponse<EntryResponse>
): Promise<void> => {
    if (!(await hasSession(req, res))) {
        // require current session
        return
    }
    if (!isPost(req, res) || !hasIds(req, res)) {
        // require post request with list of ids
        return
    }

    // delete entries, return status
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
