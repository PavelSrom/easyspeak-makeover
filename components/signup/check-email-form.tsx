import { Form, Formik } from 'formik'
import { Button, TextField } from 'ui'
import { authCheckUserSchema } from 'utils/payload-validations'

type Props = {
  onSubmit: (values: { email: string }) => Promise<void>
  isSubmitting: boolean
}

export const CheckEmailForm = ({ onSubmit, isSubmitting }: Props) => (
  <Formik
    enableReinitialize
    initialValues={{ email: '' }}
    validationSchema={authCheckUserSchema}
    onSubmit={onSubmit}
  >
    <Form>
      <TextField name="email" label="Email" />
      <Button
        fullWidth
        loading={isSubmitting}
        type="submit"
        color="secondary"
        className="mt-8"
      >
        Confirm
      </Button>
    </Form>
  </Formik>
)
