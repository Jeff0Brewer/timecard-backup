import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/client'

type ClockInRes = boolean | { message: string }

const getClockInState = async (req: NextApiRequest, res: NextApiResponse<ClockInRes>) => {
    if (req.method !== 'POST' || typeof req.body?.userEmail !== 'string') {
        res.status(405).send({ message: 'Must send user email in POST request' })
    }
    const entry = await prisma.timeEntry?.findFirst({
        where: { userEmail: req.body.userEmail },
        orderBy: { date: 'desc' }
    })
    if (!entry) {
        res.status(200).send(false)
    } else {
        res.status(200).send(entry.clockIn)
    }
}

export default getClockInState
