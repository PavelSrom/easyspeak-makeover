import type { NextPage } from 'next'
import { Formik, Form } from 'formik'
import { Button, TextField } from 'ui'
import { Example } from 'components/example'
import { useTypeSafeQuery } from 'hooks'

const Home: NextPage = () => {
  const { data: posts } = useTypeSafeQuery('getAllPosts')
  console.log(posts)

  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={values => console.log(values)}
    >
      <Form className="max-w-sm">
        <Example />
        <TextField label="First name" name="name" />
        <Button type="submit" variant="outlined" className="ml-4">
          Hello
        </Button>
      </Form>
    </Formik>
  )
}

export default Home
