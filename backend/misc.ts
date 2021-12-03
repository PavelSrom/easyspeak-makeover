import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'utils/prisma-client'

export const getAllPathwaysHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const pathways = await prisma.pathway.findMany()

    return res.json(pathways)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
