import { Paper, Switch } from '@mui/material'
import AlternateEmail from '@mui/icons-material/AlternateEmail'
import PhoneIphone from '@mui/icons-material/PhoneIphone'
import { useAuth } from 'contexts/auth'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Button, Text, TextField } from 'ui'

const initialValues = {
  password: '',
  confirmPassword: '',
}

export const ProfileSettings = () => {
  const { profile } = useAuth()
  const [notifsEmail, setNotifsEmail] = useState(profile?.receiveEmail)
  const [notifsPhone, setNotifsPhone] = useState(profile?.receiveNotifs)

  return (
    <>
      <Paper className="p-4">
        <Text variant="h1_light" className="mb-4">
          Password
        </Text>

        <Formik
          initialValues={initialValues}
          onSubmit={values => console.log(values)}
        >
          <Form className="space-y-4">
            <TextField name="password" type="password" label="Password" />
            <TextField
              name="confirmPassword"
              type="password"
              label="Confirm password"
            />
            <div className="flex justify-end">
              <Button type="submit">Change password</Button>
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
