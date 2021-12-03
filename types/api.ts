import { createNewMemberHandler } from 'backend/auth'
import { getAllCommentsHandler } from 'backend/comments'
import {
  getClubMemberByIdHandler,
  getClubMembersHandler,
} from 'backend/members'
import { getAllNotificationsHandler } from 'backend/notifications'
import { getAllPostsHandler, getPostByIdHandler } from 'backend/posts'
import { getUserProfileHandler } from 'backend/profile'
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

export type ProfileDTO = ApiResponse<ReturnType<typeof getUserProfileHandler>>

export type MemberSimpleDTO = ApiResponse<
  ReturnType<typeof getClubMembersHandler>
>[number]

export type MemberFullDTO = ApiResponse<
  ReturnType<typeof getClubMemberByIdHandler>
>
