import axios from 'axios'
import {
  NewUserDTO,
  NotificationDTO,
  PostFullDTO,
  PostSimpleDTO,
} from 'types/api'
import { CreateMemberPayload, CreatePostPayload } from 'types/payloads'

export const requests = {
  query: {
    // POSTS
    getAllPosts: (): Promise<PostSimpleDTO[]> =>
      axios.get('/api/posts').then(response => response.data),
    getPostById: (id: string): Promise<PostFullDTO> =>
      axios.get(`/api/posts/${id}`).then(response => response.data),
    // NOTIFICATIONS
    getAllNotifications: (): Promise<NotificationDTO[]> =>
      axios.get('/api/notifications').then(response => response.data),
  },
  mutation: {
    // AUTH
    createNewMember: (email: string): Promise<NewUserDTO> =>
      axios
        .post('/api/auth/create-member', { email })
        .then(response => response.data),
    deleteNewMemberById: (id: string): Promise<{ message: string }> =>
      axios
        .delete(`/api/auth/create-member/${id}`)
        .then(response => response.data),
    authCheckUser: (email: string): Promise<{ id: string }> =>
      axios
        .post('/api/auth/check-user', { email })
        .then(response => response.data),
    authSignup: (payload: CreateMemberPayload): Promise<{ message: string }> =>
      axios.post('/api/auth/signup', payload).then(response => response.data),
    deleteUserAccount: (): Promise<{ message: string }> =>
      axios.delete('/api/auth/delete').then(response => response.data),
    // NOTIFICATIONS
    markNotificationAsRead: (id: string): Promise<NotificationDTO> =>
      axios.put(`/api/notifications/${id}`).then(response => response.data),
    deleteNotificationById: (id: string): Promise<{ message: string }> =>
      axios.delete(`/api/notifications/${id}`).then(response => response.data),
    // POSTS
    createNewPost: (payload: CreatePostPayload): Promise<PostFullDTO> =>
      axios.post('/api/posts', payload).then(response => response.data),
    updatePostById: (
      id: string,
      payload: CreatePostPayload
    ): Promise<PostFullDTO> =>
      axios.put(`/api/posts/${id}`, payload).then(response => response.data),
    deletePostById: (id: string): Promise<{ message: string }> =>
      axios.delete(`/api/posts/${id}`).then(response => response.data),
  },
}
