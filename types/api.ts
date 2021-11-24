import { getAllUsersHandler } from 'backend/hello'
import { ApiResponse } from './helpers'

// dummy type for json placeholder
export type Post = {
  id: number
  userId: number
  title: string
  body: string
}

export type User = ApiResponse<ReturnType<typeof getAllUsersHandler>>[number]
