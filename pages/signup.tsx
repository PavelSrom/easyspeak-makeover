import { Container } from '@mui/material'
import { CheckEmailForm } from 'components/signup/check-email-form'
import { SignUpForm } from 'components/signup/signup-form'
import { useAuth } from 'contexts/auth'
import { useTypeSafeMutation, useTypeSafeQuery } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { CreateMemberPayload } from 'types/payloads'
import { Text } from 'ui'

const SignUp: CustomNextPage = () => {
  const [emailVerified, setEmailVerified] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { checkMemberEmail, userId } = useAuth()
  const router = useRouter()

  const { data: pathways } = useTypeSafeQuery('getAllPathways', {
    enabled: emailVerified && !!userId,
  })

  const { mutateAsync: signup } = useTypeSafeMutation('authSignup', {
    onSuccess: () => {
      router.push('/signin')
    },
  })

  const handleEmailCheck = async (values: { email: string }): Promise<void> => {
    setIsSubmitting(true)

    await checkMemberEmail(values.email)
    setEmailVerified(true)
    setIsSubmitting(false)
  }

  const handleSignup = async (
    values: Omit<CreateMemberPayload, 'id'>
  ): Promise<void> => {
    setIsSubmitting(true)

    await signup([{ id: userId!, ...values }])
    setIsSubmitting(false)
  }

  return (
    <Container className="py-4">
      {emailVerified && userId ? (
        <SignUpForm
          pathways={pathways ?? []}
          onSubmit={handleSignup}
          isSubmitting={isSubmitting}
        />
      ) : (
        <>
          <Text variant="h1_light">Confirm your email</Text>
          <Text variant="body2" className="mb-8">
            You should have received an invitation email to create your account
            by now. If you have not, please contact your VP of Membership.
          </Text>

          <CheckEmailForm
            onSubmit={handleEmailCheck}
            isSubmitting={isSubmitting}
          />
        </>
      )}
      <Text variant="body2" className="text-right mt-4">
        Already have an account?{' '}
        <span className="text-red-500">
          <Link href="/signin">Sign in</Link>
        </span>
      </Text>
    </Container>
  )
}

SignUp.pageTitle = 'Sign up'

export default SignUp
