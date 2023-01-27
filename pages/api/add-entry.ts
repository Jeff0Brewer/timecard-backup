import type { NextApiRequest, NextApiResponse } from 'next'
import { isEntryData } from '@/lib/types'
import prisma from '@/prisma/client'

const addEntry = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST' || !isEntryData(req.body)) {
        res.status(405).send({ message: 'Must send entry in POST request' })
    }
    try {
        await prisma.timeEntry.create({ data: req.body })
        res.status(200).send({ message: 'entry created' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: 'entry creation failed' })
    }
}

export default addEntry
