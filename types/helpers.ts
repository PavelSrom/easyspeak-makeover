import { Session } from 'next-auth'

export type Unpromisify<T> = T extends Promise<infer U> ? U : T

export type ApiResponse<T> = T extends Promise<infer U>
  ? U extends void
    ? never
    : U
  : never

export type ErrorResponse = {
  response: {
    data: {
      msg: string
    }
  }
}

export type ApiSession = Session & {
  user: {
    userId: string
    profileId?: string
  }
}
