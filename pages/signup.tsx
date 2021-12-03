import { Container } from '@mui/material'
import { CheckEmailForm } from 'components/signup/check-email-form'
import { SignUpForm } from 'components/signup/signup-form'
import { useAuth } from 'contexts/auth'
import { useTypeSafeMutation } from 'hooks'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { CreateMemberPayload } from 'types/payloads'
import { Text } from 'ui'

const SignUp: CustomNextPage = () => {
  const [emailVerified, setEmailVerified] = useState<boolean>(false)
  const { checkMemberEmail, userId } = useAuth()
  const router = useRouter()

  const { mutateAsync: signup } = useTypeSafeMutation('authSignup', {
    onSuccess: () => {
      router.push('/signin')
    },
  })

  const handleEmailCheck = async (values: { email: string }): Promise<void> => {
    await checkMemberEmail(values.email)
    setEmailVerified(true)
  }

  const handleSignup = async (
    values: Omit<CreateMemberPayload, 'id'>
  ): Promise<void> => {
    await signup([{ id: userId!, ...values }])
  }

  return (
    <Container className="py-4">
      {emailVerified && userId ? (
        <SignUpForm onSubmit={handleSignup} />
      ) : (
        <>
          <Text variant="h1_light">Confirm your email</Text>
          <Text variant="body2" className="mb-8">
            You should have received an invitation email to create your account
            by now. If you have not, please contact your VP of Membership.
          </Text>

          <CheckEmailForm onSubmit={handleEmailCheck} />
        </>
      )}
    </Container>
  )
}

SignUp.pageTitle = 'Sign up'

export default SignUp
