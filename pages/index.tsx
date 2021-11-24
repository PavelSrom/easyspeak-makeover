import type { NextPage } from 'next'
import { Example } from 'components/example'
import { useTypeSafeQuery } from 'hooks'

const Home: NextPage = () => {
  const { data: posts } = useTypeSafeQuery('getAllPosts')
  console.log(posts)

  return <Example />
}

export default Home
