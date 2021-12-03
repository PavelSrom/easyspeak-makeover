import { MenuItem } from '@mui/material'
import { Form, Formik } from 'formik'
import { useTypeSafeQuery } from 'hooks'
import { CreateMemberPayload } from 'types/payloads'
import { Button, Text, TextField } from 'ui'
import { authSignupSchema } from 'utils/payload-validations'

const initialValues: Omit<CreateMemberPayload, 'id'> = {
  name: '',
  surname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  pathway: '',
}

type Props = {
  onSubmit: (values: Omit<CreateMemberPayload, 'id'>) => Promise<void>
}

export const SignUpForm = ({ onSubmit }: Props) => {
  const { data: pathways } = useTypeSafeQuery('getAllPathways')

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={authSignupSchema}
      onSubmit={onSubmit}
    >
      <Form>
        <Text variant="h1_light" className="mb-4">
          Personal information
        </Text>
        <div className="space-y-6 mb-8">
          <TextField name="name" label="First name" />
          <TextField name="surname" label="Last name" />
          <TextField name="phone" label="Phone" />
        </div>
        <Text variant="h1_light" className="mt-8 mb-4">
          Password
        </Text>
        <div className="space-y-6">
          <TextField name="password" label="Password" type="password" />
          <TextField
            name="confirmPassword"
            label="Confirm password"
            type="password"
          />
        </div>
        <Text variant="h1_light" className="mt-8 mb-4">
          Pathway
        </Text>
        <TextField name="pathway" label="Pathway" select disabled={!pathways}>
          {(pathways ?? []).map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        <Button fullWidth type="submit" color="secondary" className="mt-12">
          Create profile
        </Button>
      </Form>
    </Formik>
  )
}
