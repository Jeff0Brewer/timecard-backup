import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/client'

const deleteEntries = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST' || !Array.isArray(req.body?.ids || typeof req.body.ids !== 'string')) {
        res.status(405).send({ message: 'Must send entry id array in POST request' })
    }
    const deleted = await prisma.timeEntry?.deleteMany({
        where: {
            id: {
                in: req.body.ids
            }
        }
    })

    if (deleted) {
        res.status(200).send({ message: `${deleted.count} entries deleted` })
    } else {
        res.status(500).send({ message: 'no entries deleted' })
    }
}

export default deleteEntries
