import { Dialog, DialogActions } from '@mui/material'
import { Form, Formik } from 'formik'
import { Button, Text, TextField } from 'ui'
import { createNewMemberSchema } from 'utils/payload-validations'

type Props = {
  open: boolean
  isSubmitting: boolean
  onClose: () => void
  onInvite: (values: { email: string }) => void
}

export const NewMemberDialog = ({
  open,
  isSubmitting,
  onClose,
  onInvite,
}: Props) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    onClose={onClose}
    PaperProps={{ className: 'p-4' }}
  >
    <Text variant="h1_light">Invite member</Text>
    <Text variant="body2" className="mb-6">
      Note that the member has to sign up with the same email, so be sure it’s
      the right one.
    </Text>

    <Formik
      initialValues={{ email: '' }}
      validationSchema={createNewMemberSchema}
      onSubmit={onInvite}
    >
      <Form>
        <TextField name="email" label="Email" />
        <DialogActions className="px-0 pt-6 pb-0">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isSubmitting} type="submit" color="secondary">
            Send invite
          </Button>
        </DialogActions>
      </Form>
    </Formik>
  </Dialog>
)
