import { MenuItem } from '@mui/material'
import { useAuth } from 'contexts/auth'
import { Form, Formik, FormikHelpers } from 'formik'
import { useTypeSafeMutation, useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { CreateMemberPayload } from 'types/payloads'
import { Button, TextField } from 'ui'
import {
  authCheckUserSchema,
  authSignupSchema,
} from 'utils/payload-validations'
import { PATHWAYS } from 'utils/placeholder-data'

const signupInitialValues: Omit<CreateMemberPayload, 'id'> = {
  name: '',
  surname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  pathway: '',
}

const SignUp: CustomNextPage = () => {
  const [emailVerified, setEmailVerified] = useState<boolean>(false)
  const { checkMemberEmail, userId } = useAuth()
  const router = useRouter()

  const { data: pathways } = useTypeSafeQuery('getAllPathways')
  console.log(pathways)

  const { mutateAsync: signup } = useTypeSafeMutation('authSignup', {
    onSuccess: () => {
      router.push('/signin')
    },
  })

  const handleEmailCheck = async (values: { email: string }): Promise<void> => {
    await checkMemberEmail(values.email)
    setEmailVerified(true)
  }

  const handleSignup = async (values: CreateMemberPayload): Promise<void> => {
    await signup([values])
  }

  const handleSubmit = async (
    values: { email: string } | CreateMemberPayload,
    helpers: FormikHelpers<{ email: string } | CreateMemberPayload>
  ): Promise<void> => {
    if (emailVerified) {
      handleSignup(values as CreateMemberPayload)
    } else {
      await handleEmailCheck(values as { email: string })
      helpers.resetForm()
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={
        emailVerified && userId
          ? { id: userId, ...signupInitialValues }
          : { email: '' }
      }
      validationSchema={emailVerified ? authSignupSchema : authCheckUserSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-6">
        {emailVerified ? (
          <>
            <TextField name="name" label="First name" />
            <TextField name="surname" label="Last name" />
            <TextField name="phone" label="Phone" />
            <TextField name="password" label="Password" type="password" />
            <TextField
              name="confirmPassword"
              label="Confirm password"
              type="password"
            />
            <TextField name="pathway" label="Pathway" select>
              {PATHWAYS.map(pathway => (
                <MenuItem key={pathway} value={pathway}>
                  {pathway}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" color="secondary">
              Create profile
            </Button>
          </>
        ) : (
          <>
            <TextField name="email" label="Email" />
            <Button type="submit" color="secondary">
              Confirm
            </Button>
          </>
        )}
      </Form>
    </Formik>
  )
}

SignUp.tabs = ['One', 'two']

export default SignUp
