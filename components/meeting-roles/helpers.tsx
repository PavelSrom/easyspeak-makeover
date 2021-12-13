import Delete from '@mui/icons-material/Delete'
import AddOutlined from '@mui/icons-material/AddOutlined'
import {
  Avatar,
  Dialog,
  DialogActions,
  Divider,
  Fab,
  IconButton,
  MenuItem,
} from '@mui/material'
import { AgendaFullDTO } from 'types/api'
import { Button, Text, TextField } from 'ui'
import { useMeetingAgenda } from 'contexts/meeting-agenda'
import { useState } from 'react'
import { Form, Formik } from 'formik'

type Props = {
  helper: AgendaFullDTO['helpers'][number]
  onAssign: () => void
  onUnassign: () => void
  isLoading: boolean
}

export const MeetingRoleHelper = ({
  helper,
  onAssign,
  onUnassign,
  isLoading,
}: Props) => {
  const layoutWhenConfirmed = (
    <>
      <Avatar src={helper.Member?.avatar ?? ''} className="w-10 h-10 mr-4" />
      <div className="flex-1">
        <Text variant="h4">{helper.RoleType.name}</Text>
        <Text variant="caption">
          {`${helper.Member?.name} ${helper.Member?.surname}`}
        </Text>
      </div>
      <IconButton
        size="small"
        edge="end"
        disabled={isLoading}
        onClick={onUnassign}
      >
        <Delete />
      </IconButton>
    </>
  )

  const layoutWhenPending = (
    <>
      <Avatar src={helper.Member?.avatar ?? ''} className="w-10 h-10 mr-4" />
      <div className="flex-1">
        <Text variant="h4">{helper.RoleType.name}</Text>
        <Text variant="caption">
          {`${helper.Member?.name} ${helper.Member?.surname}`} (pending)
        </Text>
      </div>
      <IconButton size="small" edge="end">
        <Delete />
      </IconButton>
    </>
  )

  const layoutWhenUnassigned = (
    <>
      <Fab
        color="secondary"
        size="small"
        className="text-white mr-4"
        disabled={isLoading}
        onClick={onAssign}
      >
        <AddOutlined />
      </Fab>
      <div className="flex-1">
        <Text variant="h4">{helper.RoleType.name}</Text>
        <Text variant="caption">Click to sign up</Text>
      </div>
    </>
  )

  return (
    <>
      <div className="flex items-start">
        {helper.roleStatus === 'CONFIRMED' && layoutWhenConfirmed}
        {helper.roleStatus === 'PENDING' && layoutWhenPending}
        {helper.roleStatus === 'UNASSIGNED' && layoutWhenUnassigned}
      </div>

      <Divider className="my-2" />
    </>
  )
}

export const AgendaHelpers = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const {
    agenda: { helpers },
    members,
    meetingId,
    isBoardMember,
    isAssigningRole,
    memberAssignRole,
    memberUnassignRole,
  } = useMeetingAgenda()

  if (helpers.length === 0)
    return (
      <Text variant="body2" className="text-center">
        (No helpers this meeting)
      </Text>
    )

  return (
    <>
      {helpers.map(helper => (
        <MeetingRoleHelper
          key={helper.id}
          helper={helper}
          isLoading={isAssigningRole}
          onAssign={() =>
            isBoardMember
              ? setDialogOpen(true)
              : memberAssignRole({
                  meetingId,
                  roleId: helper.roleTypeId,
                })
          }
          onUnassign={() =>
            memberUnassignRole({ meetingId, roleId: helper.roleTypeId })
          }
        />
      ))}

      <Dialog
        fullWidth
        maxWidth="sm"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{ className: 'p-4' }}
      >
        <Text variant="h1_light">Assign member</Text>

        <Formik
          initialValues={{ memberId: '' }}
          onSubmit={values => console.log(values)}
        >
          <Form>
            <TextField
              name="memberId"
              label="Club role"
              select
              disabled={members.length === 0}
            >
              <MenuItem value="Member">Member</MenuItem>
              {members.map(member => (
                <MenuItem key={member.id} value={member.id}>
                  {`${member.name} ${member.surname}`}
                </MenuItem>
              ))}
            </TextField>
            <DialogActions className="px-0 pt-6 pb-0">
              <Button variant="outlined" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" color="secondary">
                Assign
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </>
  )
}
