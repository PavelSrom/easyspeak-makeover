import { getAllUsersHandler } from 'backend/hello'
import { ApiResponse } from './helpers'

export type User = ApiResponse<ReturnType<typeof getAllUsersHandler>>[number]
