import { createNewMemberHandler } from 'backend/auth'
import { getAllCommentsHandler } from 'backend/comments'
import { getAllNotificationsHandler } from 'backend/notifications'
import { getAllPostsHandler, getPostByIdHandler } from 'backend/posts'
import { ApiResponse } from './helpers'

export type NewUserDTO = ApiResponse<ReturnType<typeof createNewMemberHandler>>

export type NotificationDTO = ApiResponse<
  ReturnType<typeof getAllNotificationsHandler>
>[number]

export type PostSimpleDTO = ApiResponse<
  ReturnType<typeof getAllPostsHandler>
>[number]

export type PostFullDTO = ApiResponse<ReturnType<typeof getPostByIdHandler>>

export type CommentDTO = ApiResponse<
  ReturnType<typeof getAllCommentsHandler>
>[number]
