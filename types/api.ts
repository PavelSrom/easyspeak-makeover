import { createNewMemberHandler } from 'backend/auth'
import { getAllNotificationsHandler } from 'backend/notifications'
import { ApiResponse } from './helpers'

// dummy type for json placeholder
export type Post = {
  id: number
  userId: number
  title: string
  body: string
}

export type NewUserDTO = ApiResponse<ReturnType<typeof createNewMemberHandler>>

export type NotificationDTO = ApiResponse<
  ReturnType<typeof getAllNotificationsHandler>
>[number]
