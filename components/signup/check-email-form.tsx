import { Form, Formik } from 'formik'
import { Button, TextField } from 'ui'
import { authCheckUserSchema } from 'utils/payload-validations'

type Props = {
  onSubmit: (values: { email: string }) => void | Promise<void>
}

export const CheckEmailForm = ({ onSubmit }: Props) => (
  <Formik
    enableReinitialize
    initialValues={{ email: '' }}
    validationSchema={authCheckUserSchema}
    onSubmit={onSubmit}
  >
    <Form>
      <TextField name="email" label="Email" />
      <Button fullWidth type="submit" color="secondary" className="mt-8">
        Confirm
      </Button>
    </Form>
  </Formik>
)
