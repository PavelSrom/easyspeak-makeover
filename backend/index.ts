import axios from 'axios'
import { Post } from 'types/api'
import { CreateMemberPayload } from 'types/payloads'

export const requests = {
  query: {
    getAllPosts: (): Promise<Post[]> =>
      axios
        .get('http://jsonplaceholder.typicode.com/posts')
        .then(response => response.data),
  },
  mutation: {
    createNewMember: (payload: { email: string }): Promise<any> =>
      axios
        .post('/api/auth/create-member', payload)
        .then(response => response.data),
    deleteNewMemberById: (id: string): Promise<{ message: string }> =>
      axios
        .delete(`/api/auth/create-member/${id}`)
        .then(response => response.data),
    authCheckUser: (payload: { email: string }): Promise<{ id: string }> =>
      axios
        .post('/api/auth/check-user', payload)
        .then(response => response.data),
    authSignup: (payload: CreateMemberPayload): Promise<{ message: string }> =>
      axios.post('/api/auth/signup', payload).then(response => response.data),
  },
}
