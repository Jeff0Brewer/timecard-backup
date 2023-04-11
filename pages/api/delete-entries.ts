import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'

const deleteEntries = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    if (req.method !== 'POST' || !Array.isArray(req.body?.ids || typeof req.body.ids !== 'string')) {
        res.status(405).json({ message: 'Must send entry id array in POST request' })
        return
    }
    const deleted = await prisma.timeEntry?.deleteMany({
        where: { id: { in: req.body.ids } }
    })

    if (deleted.count === req.body.ids.length) {
        res.status(200).json({ message: 'Deletion successful' })
    } else if (deleted) {
        res.status(500).json({ message: `Partial deletion, ${deleted.count} entries deleted` })
    } else {
        res.status(500).json({ message: 'Deletion failed' })
    }
}

export default deleteEntries
