import type { NextApiRequest, NextApiResponse } from 'next'
import type { JobData, JobResponse } from '@/lib/types'
import prisma from '@/prisma/client'
import { hasSession, hasFields } from '@/lib/api'

type GetJobsRequest = {
    method: 'POST',
    body: {
        userEmail: string
    }
}

const getJobs = async (
    req: NextApiRequest,
    res: NextApiResponse<JobResponse>
): Promise<void> => {
    const authorized = await hasSession(req, res)
    const complete = hasFields<GetJobsRequest>(req, res)
    if (!authorized || !complete) { return }

    const jobs: Array<JobData> = await prisma.job.findMany({
        where: { userEmail: req.body.userEmail }
    })
    res.status(200).json({ data: jobs })
}

export default getJobs
