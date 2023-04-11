import type { NextApiRequest, NextApiResponse } from 'next'
import { isEntryData, EntryData, EntryResponse } from '@/lib/types'
import prisma from '@/prisma/client'

const addEntry = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>) => {
    if (req.method !== 'POST' || !isEntryData(req.body)) {
        res.status(405).json({ message: 'Must send entry in POST request' })
        return
    }
    const entry: EntryData = await prisma.timeEntry.create({ data: req.body })
    res.status(200).json({ data: [entry] })
}

export default addEntry
