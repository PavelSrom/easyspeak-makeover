import axios from 'axios'
import { Post } from 'types/api'

export const requests = {
  query: {
    getAllPosts: (): Promise<Post[]> =>
      axios
        .get('http://jsonplaceholder.typicode.com/posts')
        .then(response => response.data),
  },
  mutation: {},
}
