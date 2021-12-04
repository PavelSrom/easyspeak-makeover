import { Dialog, DialogActions } from '@mui/material'
import { Form, Formik } from 'formik'
import { CreatePostPayload } from 'types/payloads'
import { Button, Text, TextField } from 'ui'
import { createNewPostSchema } from 'utils/payload-validations'

const initialValues = {
  title: '',
  body: '',
}

type Props = {
  open: boolean
  isSubmitting: boolean
  onClose: () => void
  onCreate: (values: CreatePostPayload) => void
}

export const NewPostDialog = ({
  open,
  isSubmitting,
  onClose,
  onCreate,
}: Props) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    onClose={onClose}
    PaperProps={{ className: 'p-4' }}
  >
    <Text variant="h1_light">Create post</Text>

    <Formik
      initialValues={initialValues}
      validationSchema={createNewPostSchema}
      onSubmit={onCreate}
    >
      <Form className="space-y-4 mt-4">
        <TextField name="title" label="Post title" />
        <TextField name="body" label="Post description" />
        <DialogActions className="px-0 pt-6 pb-0">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isSubmitting} type="submit" color="secondary">
            Create
          </Button>
        </DialogActions>
      </Form>
    </Formik>
  </Dialog>
)
