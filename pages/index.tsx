import type { NextPage } from 'next'
import { Button, TextField } from '@mui/material'
import { Example } from 'components/example'
import { useTypeSafeQuery } from 'hooks'

const Home: NextPage = () => {
  const { data: posts } = useTypeSafeQuery('getAllPosts')
  console.log(posts)

  return (
    <>
      <Example />
      <TextField variant="filled" label="Name" />
      <Button variant="outlined" className="ml-4">
        Hello
      </Button>
    </>
  )
}

export default Home
