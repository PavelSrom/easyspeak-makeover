export type CreateMemberPayload = {
  id: string
  name: string
  surname: string
  phone: string
  password: string
  confirmPassword: string
  pathway: string
}

export type UpdateProfilePayload = Partial<{
  avatar: string
  name: string
  surname: string
  phone: string
  pathway: string
  password: string
  confirmPassword: string
  receiveEmail: boolean
  receiveNotifs: boolean
}>

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

export type CreateMeetingPayload = {
  description: string
  venue: string
  start: string
  end: string
  agenda: { id: string; name: string }[]
}
