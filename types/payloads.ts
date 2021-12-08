import { ProfileDTO } from './api'

export type CreateMemberPayload = {
  id: string
  name: string
  surname: string
  phone: string
  password: string
  confirmPassword: string
  pathway: string
}

export type AuthSignInPayload = {
  email: string
  password: string
}

export type CreatePostPayload = {
  title: string
  body: string
}

export type CreateCommentPayload = {
  postId: string
  message: string
}

export type UpdateProfilePayload = Partial<ProfileDTO>

export type CreateMeetingPayload = {
  description: string
  venue: string
  start: string
  end: string
  agenda: { id: string; name: string }[]
}
