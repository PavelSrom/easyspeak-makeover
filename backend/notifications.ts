import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { prisma } from 'utils/prisma-client'

export const getAllNotificationsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { receiverId: session.user.profileId },
    })

    res.json(notifications)
    return notifications
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const markNotificationAsReadHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const notificationToUpdate = await prisma.notification.findUnique({
      where: { id: req.query.id as string },
    })
    if (notificationToUpdate?.receiverId !== session.user.profileId)
      return res.status(403).json({ message: 'Access denied' })

    const updatedNotification = await prisma.notification.update({
      where: { id: req.query.id as string },
      data: { read: true },
    })

    return res.json(updatedNotification)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const deleteNotificationByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const notificationToDelete = await prisma.notification.findUnique({
      where: { id: req.query.id as string },
    })
    if (notificationToDelete?.receiverId !== session.user.profileId)
      return res.status(403).json({ message: 'Access denied' })

    await prisma.notification.delete({
      where: { id: req.query.id as string },
    })

    return res.json({ message: 'Notification deleted' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
