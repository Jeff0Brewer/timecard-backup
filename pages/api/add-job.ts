import type { NextApiRequest, NextApiResponse } from 'next'
import type { JobData, JobResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasFields } from '@/lib/api'

type AddJobRequest = {
    method: 'POST',
    body: {
        job: JobData
    }
}

const addJob = async (
    req: NextApiRequest,
    res: NextApiResponse<JobResponse>
): Promise<void> => {
    const authorized = await hasSession(req, res)
    const complete = hasFields<AddJobRequest>(req, res)
    if (!authorized || !complete) { return }

    const job: JobData = await prisma.job.create({ data: req.body.job })
    res.status(200).json({ data: [job] })
}

export default addJob
