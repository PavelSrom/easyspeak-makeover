import AddOutlined from '@mui/icons-material/AddOutlined'
import Delete from '@mui/icons-material/Delete'
import { Avatar, Fab, IconButton } from '@mui/material'
import { RequestSpeechDialog } from 'components/request-speech-dialog'
import { useAuth } from 'contexts/auth'
import { useMeetingAgenda } from 'contexts/meeting-agenda'
import { createContext, useContext, useMemo, useState } from 'react'
import { AgendaFullDTO } from 'types/api'
import { Text } from 'ui'

type SpeakerItemBaseProps = {
  speaker: AgendaFullDTO['speakers'][number]
}

type SpeakerItemStaticComponents = {
  AddButtonOrAvatar: React.FC
  Information: React.FC
  DeleteIcon: React.FC
  ApproveOrReject: React.FC
  AcceptOrDecline: React.FC
}

const SpeakerItemContext = createContext<SpeakerItemBaseProps['speaker']>(
  {} as SpeakerItemBaseProps['speaker']
)

export const SpeakerItemBase: React.FC<SpeakerItemBaseProps> &
  SpeakerItemStaticComponents = ({ speaker, children }) => {
  const value: SpeakerItemBaseProps['speaker'] = useMemo(
    () => ({ ...speaker }),
    [speaker]
  )

  return (
    <SpeakerItemContext.Provider value={value}>
      {children}
    </SpeakerItemContext.Provider>
  )
}

const useSpeakerItem = (): SpeakerItemBaseProps['speaker'] => {
  const context = useContext(SpeakerItemContext)
  if (!context)
    throw new Error('useSpeakerItem must be used within SpeakerItemBase')

  return context
}

/**
 * COMPOUND COMPONENTS
 */

const AddButtonOrAvatar: React.FC = () => {
  const [speechDialogOpen, setSpeechDialogOpen] = useState<boolean>(false)
  const { isAssigningRole, meetingId, memberAssignRole } = useMeetingAgenda()
  const { roleStatus, roleTypeId, Member } = useSpeakerItem()

  return (
    <>
      {roleStatus !== 'UNASSIGNED' ? (
        <Avatar src={Member?.avatar ?? ''} className="w-10 h-10" />
      ) : (
        <>
          <Fab
            color="secondary"
            size="small"
            className="text-white"
            disabled={isAssigningRole}
            onClick={() => setSpeechDialogOpen(true)}
          >
            <AddOutlined />
          </Fab>

          <RequestSpeechDialog
            open={speechDialogOpen}
            isSubmitting={isAssigningRole}
            onClose={() => setSpeechDialogOpen(false)}
            onRequest={values =>
              memberAssignRole({
                meetingId,
                roleId: roleTypeId,
                ...values,
              })
            }
          />
        </>
      )}
    </>
  )
}

SpeakerItemBase.AddButtonOrAvatar = AddButtonOrAvatar
SpeakerItemBase.AddButtonOrAvatar.displayName =
  'SpeakerItemBase.AddButtonOrAvatar'

const Information: React.FC = () => {
  const { roleStatus, RoleType, Member, Speech } = useSpeakerItem()

  return (
    <>
      {roleStatus === 'UNASSIGNED' && (
        <>
          <Text variant="h4">{RoleType.name}</Text>
          <Text variant="caption">Click to sign up</Text>
        </>
      )}
      {roleStatus === 'PENDING' && (
        <>
          <Text variant="h4">{RoleType.name}</Text>
          <Text variant="caption">
            {`${Member?.name} ${Member?.surname}`} (pending)
          </Text>

          <div className="mt-2">
            <Text variant="body2" className="font-semibold">
              {Speech?.title}
            </Text>
            <Text variant="small">{Speech?.description}</Text>
          </div>
        </>
      )}
      {roleStatus === 'CONFIRMED' && (
        <>
          <Text variant="h4">{RoleType.name}</Text>
          <Text variant="caption">{`${Member?.name} ${Member?.surname}`}</Text>

          <div className="mt-2">
            <Text variant="body2" className="font-semibold">
              {Speech?.title ?? '(No speech title)'}
            </Text>
            <Text variant="small">
              {Speech?.description ?? '(No speech description)'}
            </Text>
          </div>
        </>
      )}
    </>
  )
}

SpeakerItemBase.Information = Information
SpeakerItemBase.Information.displayName = 'SpeakerItemBase.Information'

const DeleteIcon: React.FC = () => {
  const { isBoardMember, memberUnassignRole, meetingId } = useMeetingAgenda()
  const { memberId, roleTypeId } = useSpeakerItem()
  const { profile } = useAuth()

  // do not show anything if not a board member or not their speech
  if (!isBoardMember && memberId !== profile?.id) return null

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

SpeakerItemBase.DeleteIcon = DeleteIcon
SpeakerItemBase.DeleteIcon.displayName = 'SpeakerItemBase.DeleteIcon'

// TODO
const ApproveOrReject: React.FC = () => {
  const { isBoardMember } = useMeetingAgenda()
  const { memberId } = useSpeakerItem()
  const { profile } = useAuth()

  if (!isBoardMember && memberId !== profile?.id) return null

  return (
    <IconButton size="small" edge="end" onClick={() => {}}>
      <Delete />
    </IconButton>
  )
}

SpeakerItemBase.ApproveOrReject = ApproveOrReject
SpeakerItemBase.ApproveOrReject.displayName = 'SpeakerItemBase.ApproveOrReject'

// TODO
const AcceptOrDecline: React.FC = () => {
  const { isBoardMember } = useMeetingAgenda()
  const { memberId } = useSpeakerItem()
  const { profile } = useAuth()

  if (!isBoardMember && memberId !== profile?.id) return null

  return (
    <IconButton size="small" edge="end" onClick={() => {}}>
      <Delete />
    </IconButton>
  )
}

SpeakerItemBase.AcceptOrDecline = AcceptOrDecline
SpeakerItemBase.AcceptOrDecline.displayName = 'SpeakerItemBase.AcceptOrDecline'
