import AddOutlined from '@mui/icons-material/AddOutlined'
import Delete from '@mui/icons-material/Delete'
import { Avatar, Fab, IconButton } from '@mui/material'
import { useAuth } from 'contexts/auth'
import { useMeetingAgenda } from 'contexts/meeting-agenda'
import { createContext, useContext, useMemo } from 'react'
import { AgendaFullDTO } from 'types/api'
import { Text } from 'ui'

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
  const { isAssigningRole, meetingId, memberAssignRole } = useMeetingAgenda()
  const { roleStatus, roleTypeId, Member } = useHelper()

  return (
    <>
      {roleStatus !== 'UNASSIGNED' ? (
        <Avatar src={Member?.avatar ?? ''} className="w-10 h-10" />
      ) : (
        <Fab
          color="secondary"
          size="small"
          className="text-white"
          disabled={isAssigningRole}
          onClick={() =>
            memberAssignRole({
              meetingId,
              roleId: roleTypeId,
            })
          }
        >
          <AddOutlined />
        </Fab>
      )}
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
  const { isBoardMember, memberUnassignRole, meetingId } = useMeetingAgenda()
  const { memberId, roleTypeId, roleStatus } = useHelper()
  const { profile } = useAuth()

  // do not show anything if not a board member or not their role
  if (!isBoardMember || memberId !== profile?.id || roleStatus === 'UNASSIGNED')
    return null

  return (
    <IconButton
      size="small"
      edge="end"
      onClick={() => memberUnassignRole({ meetingId, roleId: roleTypeId })}
    >
      <Delete />
    </IconButton>
  )
}

HelperBase.DeleteIcon = DeleteIcon
HelperBase.DeleteIcon.displayName = 'HelperBase.DeleteIcon'

// TODO
const AcceptOrDecline: React.FC = () => {
  const { isBoardMember } = useMeetingAgenda()
  const { memberId } = useHelper()
  const { profile } = useAuth()

  if (!isBoardMember && memberId !== profile?.id) return null

  return (
    <IconButton size="small" edge="end" onClick={() => {}}>
      <Delete />
    </IconButton>
  )
}

HelperBase.AcceptOrDecline = AcceptOrDecline
HelperBase.AcceptOrDecline.displayName = 'HelperBase.AcceptOrDecline'
