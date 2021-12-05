import { Dialog, DialogActions, MenuItem } from '@mui/material'
import { Form, Formik } from 'formik'
import { Button, Text, TextField } from 'ui'

type Props = {
  open: boolean
  name: string
  isSubmitting: boolean
  clubRoles: { id: string; name: string }[]
  onClose: () => void
  onChangeRole: (values: { clubRole: string }) => void
}

export const ChangeRoleDialog = ({
  open,
  name,
  isSubmitting,
  clubRoles,
  onClose,
  onChangeRole,
}: Props) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    onClose={onClose}
    PaperProps={{ className: 'p-4' }}
  >
    <Text variant="h1_light">Change {name}&apos;s role</Text>
    <Text variant="body2" className="mb-6">
      Change the club role for {name}
    </Text>

    <Formik
      initialValues={{ clubRole: '' }}
      // validationSchema={createNewMemberSchema} TODO
      onSubmit={onChangeRole}
    >
      <Form>
        <TextField
          name="clubRole"
          label="Club role"
          select
          disabled={clubRoles.length === 0}
        >
          <MenuItem value="Member">Member</MenuItem>
          {clubRoles.map(role => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </TextField>
        <DialogActions className="px-0 pt-6 pb-0">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isSubmitting} type="submit" color="secondary">
            Change role
          </Button>
        </DialogActions>
      </Form>
    </Formik>
  </Dialog>
)
