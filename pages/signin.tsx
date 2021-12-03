import { Formik, Form } from 'formik'
import { AuthSignInPayload } from 'types/payloads'
import { authSigninSchema } from 'utils/payload-validations'
import { Button, Text, TextField } from 'ui'
import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/client'
import { useSnackbar } from 'notistack'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CustomNextPage } from 'types/helpers'
import { Container } from '@mui/material'

const initialValues = {
  email: '',
  password: '',
}

const SignIn: CustomNextPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [session] = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (session) router.replace('/')
  }, [session, router])

  const handleSubmit = async (values: AuthSignInPayload): Promise<void> => {
    setIsSubmitting(true)

    const result = await signIn('credentials', {
      redirect: false,
      ...values,
    })

    // the above promise always resolves, therefore this if-check
    if (result?.error) {
      enqueueSnackbar(result.error || 'Unable to sign in', {
        variant: 'error',
      })
      setIsSubmitting(false)
    } else {
      enqueueSnackbar('Signed in', { variant: 'success' })
    }
  }

  return (
    <Container className="py-4">
      <Formik
        initialValues={initialValues}
        validationSchema={authSigninSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-6">
          <TextField name="email" label="Email" />
          <TextField name="password" label="Password" />
          <Button
            type="submit"
            fullWidth
            color="secondary"
            loading={isSubmitting}
          >
            Sign in
          </Button>
        </Form>
      </Formik>
      <Text variant="body2" className="text-right mt-4">
        No account?{' '}
        <span className="text-red-500">
          <Link href="/signup">Sign up</Link>
        </span>
      </Text>
    </Container>
  )
}

SignIn.pageTitle = 'Sign in'

export default SignIn
