import { createNewMemberHandler } from 'backend/auth'
import { getAllCommentsHandler } from 'backend/comments'
import {
  getClubBoardHandler,
  getClubInfoHandler,
  getClubMemberByIdHandler,
  getClubMembersHandler,
} from 'backend/club'
import { getAllNotificationsHandler } from 'backend/notifications'
import {
  getAllPostsHandler,
  getPinnedPostHandler,
  getPostByIdHandler,
} from 'backend/posts'
import { getUserActivityHandler, getUserProfileHandler } from 'backend/profile'
import {
  getAllMeetingsHandler,
  getFullAgendaHandler,
  getMeetingByIdHandler,
} from 'backend/meetings'
import { getDashBoardHandler } from 'backend/dashboard'
import { ApiResponse } from './helpers'

export type NewUserDTO = ApiResponse<ReturnType<typeof createNewMemberHandler>>

export type NotificationDTO = ApiResponse<
  ReturnType<typeof getAllNotificationsHandler>
>[number]

export type PostSimpleDTO = ApiResponse<
  ReturnType<typeof getAllPostsHandler>
>[number]

export type PostFullDTO = ApiResponse<ReturnType<typeof getPostByIdHandler>>

export type PinnedPostDTO = ApiResponse<ReturnType<typeof getPinnedPostHandler>>

export type CommentDTO = ApiResponse<
  ReturnType<typeof getAllCommentsHandler>
>[number]

export type ProfileDTO = ApiResponse<ReturnType<typeof getUserProfileHandler>>

export type ProfileActivityDTO = ApiResponse<
  ReturnType<typeof getUserActivityHandler>
>

export type MemberSchemaDTO = ApiResponse<
  ReturnType<typeof getClubMembersHandler>
>

export type BoardSimpleDTO = ApiResponse<
  ReturnType<typeof getClubBoardHandler>
>[number]

export type MemberFullDTO = ApiResponse<
  ReturnType<typeof getClubMemberByIdHandler>
>

export type ClubInfoDTO = ApiResponse<ReturnType<typeof getClubInfoHandler>>

export type MeetingSimpleDTO = ApiResponse<
  ReturnType<typeof getAllMeetingsHandler>
>[number]

export type MeetingFullDTO = ApiResponse<
  ReturnType<typeof getMeetingByIdHandler>
>

export type AgendaFullDTO = ApiResponse<ReturnType<typeof getFullAgendaHandler>>

export type DashboardDTO = ApiResponse<ReturnType<typeof getDashBoardHandler>>
