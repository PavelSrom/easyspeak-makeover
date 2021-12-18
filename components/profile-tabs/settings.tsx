import { Paper, Switch } from '@mui/material'
import AlternateEmail from '@mui/icons-material/AlternateEmail'
import PhoneIphone from '@mui/icons-material/PhoneIphone'
import { useAuth } from 'contexts/auth'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Button, Text, TextField } from 'ui'
import { useTypeSafeMutation } from 'hooks'
import { useSnackbar } from 'notistack'
import { changePasswordSchema } from 'utils/payload-validations'

const initialValues = {
  password: '',
  confirmPassword: '',
}

export const ProfileSettings = () => {
  const { profile } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [notifsEmail, setNotifsEmail] = useState(profile?.receiveEmail)
  const [notifsPhone, setNotifsPhone] = useState(profile?.receiveNotifs)

  const { mutateAsync: changePassword, isLoading: isChangingPassword } =
    useTypeSafeMutation('changePassword', {
      onSuccess: () => {
        enqueueSnackbar('Password has been changed', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot change password', {
          variant: 'error',
        })
      },
    })

  return (
    <>
      <Paper className="p-4">
        <Text variant="h1_light" className="mb-4">
          Password
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={changePasswordSchema}
          onSubmit={async (values, { resetForm }) => {
            await changePassword([values])
            resetForm()
          }}
        >
          <Form className="space-y-4">
            <TextField name="password" type="password" label="New password" />
            <TextField
              name="confirmPassword"
              type="password"
              label="Confirm password"
            />
            <div className="flex justify-end">
              <Button loading={isChangingPassword} type="submit">
                Change password
              </Button>
            </div>
          </Form>
        </Formik>
      </Paper>

      <Paper className="p-4 mt-4 space-y-4">
        <Text variant="h1_light">Notifications (in progress)</Text>

        <div className="flex items-center">
          <AlternateEmail className="text-2xl mr-4" />
          <Text variant="h3" className="mr-auto">
            Email
          </Text>
          <Switch
            checked={notifsEmail}
            onChange={e => setNotifsEmail(e.target.checked)}
          />
        </div>
        <div className="flex items-center">
          <PhoneIphone className="text-2xl mr-4" />
          <Text variant="h3" className="mr-auto">
            SMS
          </Text>
          <Switch
            checked={notifsPhone}
            onChange={e => setNotifsPhone(e.target.checked)}
          />
        </div>
      </Paper>
    </>
  )
}
