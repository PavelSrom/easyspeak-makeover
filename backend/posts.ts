import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { createNewPostSchema, validateBody } from 'utils/payload-validations'
import { prisma } from 'utils/prisma-client'

export const getAllPostsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const where: Prisma.PostWhereInput = {}
  where.clubId = session.user.clubId as string
  if (req.query.isPinned) where.isPinned = true

  try {
    const allPosts = await prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        body: true,
        isPinned: true,
        createdAt: true,
        _count: { select: { Comments: true } },
        Author: {
          select: {
            name: true,
            surname: true,
            avatar: true,
            ClubRole: { select: { name: true } },
          },
        },
      },
    })

    res.json(allPosts)
    return allPosts
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const getPostByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.query.id as string },
      include: {
        Author: {
          select: {
            avatar: true,
            name: true,
            surname: true,
            ClubRole: { select: { name: true } },
          },
        },
      },
    })
    if (!post) return res.status(404).json({ message: 'Post not found' })

    res.json(post)
    return post
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const getPinnedPostHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const post = await prisma.post.findFirst({
      where: { clubId: session.user.clubId, isPinned: true },
      include: {
        Author: {
          select: {
            avatar: true,
            name: true,
            surname: true,
            ClubRole: { select: { name: true } },
          },
        },
      },
    })
    if (!post) return res.status(404).json({ message: 'Post not found' })

    res.json(post)
    return post
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const createNewPostHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { isValid, msg } = await validateBody(createNewPostSchema, req.body)
  if (!isValid) return res.status(400).json({ message: msg })

  const { title, body } = req.body

  try {
    const newPost = await prisma.post.create({
      data: {
        Club: { connect: { id: session.user.clubId } },
        Author: { connect: { id: session.user.profileId } },
        title,
        body,
      },
    })

    return res.status(201).json(newPost)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const updatePostByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { isValid, msg } = await validateBody(createNewPostSchema, req.body)
  if (!isValid) return res.status(400).json({ message: msg })

  const { title, body } = req.body

  try {
    const postToUpdate = await prisma.post.findUnique({
      where: { id: req.query.id as string },
    })
    if (!postToUpdate)
      return res.status(404).json({ message: 'Post not found' })
    if (postToUpdate.authorId !== session.user.profileId)
      return res.status(403).json({ message: 'Access denied' })

    const updatedPost = await prisma.post.update({
      where: { id: req.query.id as string },
      data: { title, body },
    })

    return res.json(updatedPost)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const deletePostByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.profileId },
    })
    if (!profile) return res.status(404).json({ message: 'Profile not found' })

    const postToDelete = await prisma.post.findUnique({
      where: { id: req.query.id as string },
    })
    if (!postToDelete)
      return res.status(404).json({ message: 'Post not found' })
    // if no board member and requester is not the author of the post
    if (!profile.roleTypeId && postToDelete.authorId !== session.user.profileId)
      return res.status(403).json({ message: 'Access denied' })

    const deletePostQuery = prisma.post.delete({
      where: { id: req.query.id as string },
    })
    const deleteCommentsForPostQuery = prisma.comment.deleteMany({
      where: { postId: postToDelete.id },
    })

    await prisma.$transaction([deleteCommentsForPostQuery, deletePostQuery])

    return res.json({ message: 'Post and its comments deleted' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const togglePostPinStatusHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const postToTogglePin = await prisma.post.findUnique({
      where: { id: req.query.id as string },
    })

    if (postToTogglePin?.isPinned) {
      await prisma.post.update({
        where: { id: req.query.id as string },
        data: { isPinned: false },
      })
      return res.json({ message: 'Pin is removed from post' })
    }
    const pinnedPostInClub = await prisma.post.findFirst({
      where: {
        clubId: session.user.clubId as string,
        isPinned: true as boolean,
      },
    })
    if (pinnedPostInClub) {
      return res
        .status(404)
        .json({ message: 'Pinned post in club already exist' })
    }

    await prisma.post.update({
      where: { id: req.query.id as string },
      data: { isPinned: true },
    })
    return res.json({ message: 'Post is pinned' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
