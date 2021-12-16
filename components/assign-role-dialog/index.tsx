import { Dialog, DialogActions, MenuItem } from '@mui/material'
import { Form, Formik } from 'formik'
import { MemberSchemaDTO } from 'types/api'
import { Button, Text, TextField } from 'ui'

type Props = {
  open: boolean
  defaultValue: string
  members: MemberSchemaDTO['clubMembers']
  loading: boolean
  onClose: () => void
  onAssign: (values: { memberId: string }) => void
}

export const AssignRoleDialog = ({
  open,
  defaultValue,
  members,
  loading,
  onClose,
  onAssign,
}: Props) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    open={open}
    onClose={onClose}
    PaperProps={{ className: 'p-4' }}
  >
    <Text variant="h1_light" className="mb-4">
      Assign member
    </Text>

    <Formik initialValues={{ memberId: defaultValue }} onSubmit={onAssign}>
      <Form>
        <TextField
          name="memberId"
          label="Club role"
          select
          disabled={members.length === 0}
        >
          {members.map(member => (
            <MenuItem key={member.id} value={member.id}>
              {`${member.name} ${member.surname}`}
            </MenuItem>
          ))}
        </TextField>
        <DialogActions className="px-0 pt-6 pb-0">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} type="submit" color="secondary">
            Assign
          </Button>
        </DialogActions>
      </Form>
    </Formik>
  </Dialog>
)
