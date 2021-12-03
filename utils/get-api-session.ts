import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/client'
import { ApiSession } from 'types/helpers'

export const getApiSession = async (
  req: NextApiRequest
): Promise<ApiSession | null> =>
  (await getSession({ req })) as ApiSession | null
