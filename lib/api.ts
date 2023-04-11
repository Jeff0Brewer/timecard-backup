import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { EntryResponse } from '@/lib/types'

const checkSession = async (req: NextApiRequest, res: NextApiResponse<EntryResponse>): Promise<boolean> => {
    const session = await getSession({ req })
    if (!session) {
        res.status(401).json({ message: 'Unauthorized request' })
        return false
    }
    return true
}

export {
    checkSession
}
