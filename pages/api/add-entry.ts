import type { NextApiRequest, NextApiResponse } from 'next'
import { isEntryData, EntryData } from '@/lib/types'
import prisma from '@/prisma/client'

type AddResponse = EntryData | { message: string }

const addEntry = async (req: NextApiRequest, res: NextApiResponse<AddResponse>) => {
    if (req.method !== 'POST' || !isEntryData(req.body)) {
        res.status(405).send({ message: 'Must send entry in POST request' })
        return
    }
    try {
        const entry = await prisma.timeEntry.create({ data: req.body })
        res.status(200).send(entry)
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'entry creation failed' })
    }
}

export default addEntry
