import axios from 'axios'
import { NewUserDTO, NotificationDTO, Post } from 'types/api'
import { CreateMemberPayload } from 'types/payloads'

export const requests = {
  query: {
    getAllPosts: (): Promise<Post[]> =>
      axios
        .get('http://jsonplaceholder.typicode.com/posts')
        .then(response => response.data),
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
  },
}
