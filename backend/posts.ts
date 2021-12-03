import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { createNewPostSchema, validateBody } from 'utils/payload-validations'
import { prisma } from 'utils/prisma-client'

export const getAllPostsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const allPosts = await prisma.post.findMany({
      where: { clubId: session.user.clubId },
      select: { id: true, title: true, createdAt: true, isPinned: true },
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
      include: { Author: { select: { id: true, name: true, surname: true } } },
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
  const { isValid, msg } = await validateBody(createNewPostSchema, req)
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
  const { isValid, msg } = await validateBody(createNewPostSchema, req)
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
    const postToDelete = await prisma.post.findUnique({
      where: { id: req.query.id as string },
    })
    if (!postToDelete)
      return res.status(404).json({ message: 'Post not found' })
    if (postToDelete.authorId !== session.user.profileId)
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

// export const togglePostPinStatusHandler = async (
//   req: NextApiRequest,
//   res: NextApiResponse,
//   session: ApiSession
// ) => {
//   const { pin } = req.query

//   try {
//     const postToTogglePin = await prisma.post.findUnique({
//       where: { id: req.query.id as string },
//     })
//   } catch ({ message }) {
//     return res.status(500).json({ message })
//   }
// }
