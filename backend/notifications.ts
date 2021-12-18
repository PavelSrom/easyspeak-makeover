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
      // order by unread first, then from newest to oldest
      orderBy: [{ read: 'asc' }, { createdAt: 'desc' }],
    })

    res.json(notifications)
    return notifications
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const markNotificationsAsReadHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const notificationsToUpdate = await prisma.notification.findMany({
      where: { receiverId: session.user.profileId, read: false },
    })
    const allNotifsBelongToUser = notificationsToUpdate.every(
      notif => notif.receiverId === session.user.profileId
    )

    if (!allNotifsBelongToUser)
      return res.status(403).json({ message: 'Access denied' })

    const updatedNotifications = await prisma.notification.updateMany({
      where: { receiverId: session.user.profileId, read: false },
      data: { read: true },
    })

    return res.json(updatedNotifications)
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
