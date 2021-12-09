import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'utils/prisma-client'
import { ApiSession } from 'types/helpers'
import { createNewCommentSchema, validateBody } from 'utils/payload-validations'
import { Prisma } from '.prisma/client'

export const getAllCommentsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const where: Prisma.CommentWhereInput = {}
  if (req.query.postId) where.postId = req.query.postId as string
  if (req.query.userId) where.authorId = req.query.userId as string

  try {
    const allComments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: {
        Author: { select: { avatar: true, name: true, surname: true } },
      },
    })

    res.json(allComments)
    return allComments
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const createNewCommentHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { isValid, msg } = await validateBody(createNewCommentSchema, req.body)
  if (!isValid) return res.status(400).json({ message: msg })

  const { postId, message: commentMessage } = req.body

  try {
    const newComment = await prisma.comment.create({
      data: {
        Author: { connect: { id: session.user.profileId } },
        Post: { connect: { id: postId } },
        message: commentMessage,
      },
      include: {
        Author: { select: { avatar: true, name: true, surname: true } },
      },
    })

    return res.status(201).json(newComment)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const deleteCommentByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const commentToDelete = await prisma.comment.findUnique({
      where: { id: req.query.id as string },
    })
    if (!commentToDelete)
      return res.status(404).json({ message: 'Comment not found' })
    if (commentToDelete.authorId !== session.user.profileId)
      return res.status(403).json({ message: 'Access denied' })

    await prisma.comment.delete({ where: { id: req.query.id as string } })

    return res.json({ message: 'Comment deleted' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
