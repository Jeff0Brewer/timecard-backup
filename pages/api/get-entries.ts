import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData } from '@/lib/types'
import prisma from '@/prisma/client'

type EntriesRes = Array<EntryData> | { message: string }

const getEntries = async (req: NextApiRequest, res: NextApiResponse<EntriesRes>) => {
    if (req.method !== 'POST' || typeof req.body?.userEmail !== 'string') {
        res.status(405).send({ message: 'Must send user email in POST request' })
    }
    const entries: Array<EntryData> = await prisma.timeEntry?.findMany({
        where: { userEmail: req.body.userEmail },
        orderBy: { date: 'desc' }
    })
    res.status(200).send(entries)
}

export default getEntries
