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
  isPinned: boolean
}

export type CreateCommentPayload = {
  message: string
}
