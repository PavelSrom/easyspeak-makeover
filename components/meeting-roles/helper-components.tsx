import AddOutlined from '@mui/icons-material/AddOutlined'
import Delete from '@mui/icons-material/Delete'
import { Avatar, Fab, IconButton } from '@mui/material'
import { AssignRoleDialog } from 'components/assign-role-dialog'
import { useAuth } from 'contexts/auth'
import { useMeetingAgenda } from 'contexts/meeting-agenda'
import { createContext, useContext, useMemo, useState } from 'react'
import { AgendaFullDTO } from 'types/api'
import { Button, ConfirmationDialog, Text } from 'ui'

type HelperBaseProps = {
  helper: AgendaFullDTO['helpers'][number]
}

type HelperStaticComponents = {
  AddButtonOrAvatar: React.FC
  Information: React.FC
  DeleteIcon: React.FC
  AcceptOrDecline: React.FC
}

const HelperContext = createContext<HelperBaseProps['helper']>(
  {} as HelperBaseProps['helper']
)

// this is shared for both evaluators and helper roles
export const HelperBase: React.FC<HelperBaseProps> & HelperStaticComponents = ({
  helper,
  children,
}) => {
  const value: HelperBaseProps['helper'] = useMemo(
    () => ({ ...helper }),
    [helper]
  )

  return (
    <HelperContext.Provider value={value}>{children}</HelperContext.Provider>
  )
}

const useHelper = (): HelperBaseProps['helper'] => {
  const context = useContext(HelperContext)
  if (!context)
    throw new Error('useHelperItem must be used within SpeakerItemBase')

  return context
}

/**
 * COMPOUND COMPONENTS
 */

const AddButtonOrAvatar: React.FC = () => {
  const { roleStatus, roleTypeId, Member } = useHelper()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] =
    useState<boolean>(false)
  const { profile } = useAuth()
  const {
    isBoardMember,
    meetingIsReadOnly,
    meetingId,
    memberAssignRole,
    adminAssignRole,
    members,
  } = useMeetingAgenda()

  const handleButtonClick = () => {
    if (isBoardMember) {
      setAssignRoleDialogOpen(true)
    } else {
      memberAssignRole({
        meetingId,
        roleId: roleTypeId,
      })
    }
  }

  return (
    <>
      {roleStatus !== 'UNASSIGNED' ? (
        <Avatar src={Member?.avatar ?? ''} className="w-10 h-10" />
      ) : (
        <Fab
          color="secondary"
          size="small"
          className="text-white"
          disabled={meetingIsReadOnly}
          onClick={handleButtonClick}
        >
          <AddOutlined />
        </Fab>
      )}

      <AssignRoleDialog
        open={assignRoleDialogOpen}
        defaultValue={profile?.id ?? ''}
        members={members}
        loading={isLoading}
        onClose={() => setAssignRoleDialogOpen(false)}
        onAssign={async ({ memberId }) => {
          setIsLoading(true)

          await adminAssignRole({ memberId, meetingId, roleId: roleTypeId })
          setAssignRoleDialogOpen(false)
          setIsLoading(false)
        }}
      />
    </>
  )
}

HelperBase.AddButtonOrAvatar = AddButtonOrAvatar
HelperBase.AddButtonOrAvatar.displayName = 'HelperBase.AddButtonOrAvatar'

const Information: React.FC = () => {
  const { roleStatus, RoleType, Member } = useHelper()

  return (
    <>
      <Text variant="h4">{RoleType.name}</Text>
      {roleStatus === 'UNASSIGNED' && (
        <Text variant="caption">Click to sign up</Text>
      )}
      {roleStatus === 'PENDING' && (
        <Text variant="caption">
          {`${Member?.name} ${Member?.surname}`} (pending)
        </Text>
      )}
      {roleStatus === 'CONFIRMED' && (
        <Text variant="caption">{`${Member?.name} ${Member?.surname}`}</Text>
      )}
    </>
  )
}

HelperBase.Information = Information
HelperBase.Information.displayName = 'HelperBase.Information'

const DeleteIcon: React.FC = () => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isBoardMember, memberUnassignRole, meetingId, meetingIsReadOnly } =
    useMeetingAgenda()
  const { memberId, roleTypeId, roleStatus } = useHelper()
  const { profile } = useAuth()

  const isMyRole = profile?.id === memberId
  const isConfirmedRole = roleStatus === 'CONFIRMED'

  if (!isBoardMember) return null
  if (!isMyRole) return null
  if (!isConfirmedRole) return null
  if (meetingIsReadOnly) return null

  return (
    <>
      <IconButton
        size="small"
        edge="end"
        onClick={() => setConfirmDialogOpen(true)}
      >
        <Delete />
      </IconButton>

      <ConfirmationDialog
        loading={isLoading}
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={async () => {
          setIsLoading(true)

          await memberUnassignRole({ meetingId, roleId: roleTypeId })
          setIsLoading(false)
        }}
        description="Are you sure you want to remove yourself from this role?"
        confirmText="Remove"
      />
    </>
  )
}

HelperBase.DeleteIcon = DeleteIcon
HelperBase.DeleteIcon.displayName = 'HelperBase.DeleteIcon'

const AcceptOrDecline: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { acceptAssignedRole, meetingId, meetingIsReadOnly } =
    useMeetingAgenda()
  const { id, memberId, roleStatus } = useHelper()
  const { profile } = useAuth()

  const handleAccept = (accepted: boolean): void => {
    setIsLoading(true)

    acceptAssignedRole({
      meetingId,
      roleId: id,
      accepted,
    }).finally(() => setIsLoading(false))
  }

  const isMyRole = profile?.id === memberId
  const isPending = roleStatus === 'PENDING'

  if (!isMyRole) return null
  if (!isPending) return null
  if (meetingIsReadOnly) return null

  return (
    <div className="flex space-x-4 mt-4">
      <Button
        color="secondary"
        loading={isLoading}
        onClick={() => handleAccept(true)}
      >
        Accept
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        loading={isLoading}
        onClick={() => handleAccept(false)}
      >
        Decline
      </Button>
    </div>
  )
}

HelperBase.AcceptOrDecline = AcceptOrDecline
HelperBase.AcceptOrDecline.displayName = 'HelperBase.AcceptOrDecline'
