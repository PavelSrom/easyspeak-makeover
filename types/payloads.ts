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

export type PasswordChangePayload = {
  password: string
  confirmPassword: string
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

export type MemberRoleAssignPayload = {
  meetingId: string
  roleId: string
  title?: string // signing up for speech
  description?: string // signing up for speech
}

export type AdminRoleAssignPayload = {
  meetingId: string
  roleId: string
  memberId: string
}
