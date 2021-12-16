import { Dialog, DialogActions } from '@mui/material'
import { Form, Formik } from 'formik'
import { Button, Text, TextField } from 'ui'
import { requestSpeechSchema } from 'utils/payload-validations'

const initialValues = {
  title: '',
  description: '',
}

type Props = {
  open: boolean
  isSubmitting: boolean
  onClose: () => void
  onRequest: (values: typeof initialValues) => void
}

export const RequestSpeechDialog = ({
  open,
  isSubmitting,
  onClose,
  onRequest,
}: Props) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    onClose={onClose}
    PaperProps={{ className: 'p-4' }}
  >
    <Text variant="h1_light" className="mb-6">
      Request a speech
    </Text>

    <Formik
      initialValues={initialValues}
      validationSchema={requestSpeechSchema}
      onSubmit={onRequest}
    >
      <Form className="space-y-4">
        <TextField name="title" label="Speech title" />
        <TextField name="description" label="Speech description" />
        <DialogActions className="px-0 pt-2 pb-0">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isSubmitting} type="submit" color="secondary">
            Request
          </Button>
        </DialogActions>
      </Form>
    </Formik>
  </Dialog>
)
