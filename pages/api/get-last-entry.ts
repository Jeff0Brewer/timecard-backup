import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData } from '@/lib/types'
import prisma from '@/prisma/client'

type ClockInRes = EntryData | null | { message: string }

const getLastEntry = async (req: NextApiRequest, res: NextApiResponse<ClockInRes>) => {
    if (req.method !== 'POST' || typeof req.body?.userEmail !== 'string') {
        res.status(405).send({ message: 'Must send user email in POST request' })
    }
    const entry = await prisma.timeEntry?.findFirst({
        where: { userEmail: req.body.userEmail },
        orderBy: { date: 'desc' }
    })
    res.status(200).send(entry)
}

export default getLastEntry
