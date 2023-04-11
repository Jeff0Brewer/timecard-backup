import type { NextApiRequest, NextApiResponse } from 'next'
import type { EntryData, EntryResponse } from '@/lib/types'
import { newEntryData } from '@/lib/types'
import prisma from '@/prisma/client'

const getLastEntry = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    if (req.method !== 'POST' || typeof req.body?.userEmail !== 'string') {
        res.status(405).json({ message: 'Must send user email in POST request' })
        return
    }
    let entry: EntryData | null = await prisma.timeEntry?.findFirst({
        where: { userEmail: req.body.userEmail },
        orderBy: { date: 'desc' }
    })
    if (!entry) {
        entry = newEntryData()
    }
    res.status(200).json({ data: [entry] })
}

export default getLastEntry
