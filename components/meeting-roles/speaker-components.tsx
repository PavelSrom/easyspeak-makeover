import AddOutlined from '@mui/icons-material/AddOutlined'
import Delete from '@mui/icons-material/Delete'
import { Avatar, Fab, IconButton } from '@mui/material'
import { AssignRoleDialog } from 'components/assign-role-dialog'
import { RequestSpeechDialog } from 'components/request-speech-dialog'
import { useAuth } from 'contexts/auth'
import { useMeetingAgenda } from 'contexts/meeting-agenda'
import { createContext, useContext, useMemo, useState } from 'react'
import { AgendaFullDTO } from 'types/api'
import { Button, Text } from 'ui'

type SpeakerBaseProps = {
  speaker: AgendaFullDTO['speakers'][number]
}

type SpeakerStaticComponents = {
  AddButtonOrAvatar: React.FC
  Information: React.FC
  DeleteIcon: React.FC
  ApproveOrReject: React.FC
  AcceptOrDecline: React.FC
}

const SpeakerContext = createContext<SpeakerBaseProps['speaker']>(
  {} as SpeakerBaseProps['speaker']
)

export const SpeakerBase: React.FC<SpeakerBaseProps> & SpeakerStaticComponents =
  ({ speaker, children }) => {
    const value: SpeakerBaseProps['speaker'] = useMemo(
      () => ({ ...speaker }),
      [speaker]
    )

    return (
      <SpeakerContext.Provider value={value}>
        {children}
      </SpeakerContext.Provider>
    )
  }

const useSpeaker = (): SpeakerBaseProps['speaker'] => {
  const context = useContext(SpeakerContext)
  if (!context)
    throw new Error('useSpeakerItem must be used within SpeakerItemBase')

  return context
}

/**
 * COMPOUND COMPONENTS
 */

const AddButtonOrAvatar: React.FC = () => {
  const [speechDialogOpen, setSpeechDialogOpen] = useState<boolean>(false)
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] =
    useState<boolean>(false)
  const { profile } = useAuth()
  const {
    isBoardMember,
    isAssigningRole,
    meetingId,
    meetingIsReadOnly,
    members,
    memberAssignRole,
    adminAssignRole,
  } = useMeetingAgenda()
  const { roleStatus, roleTypeId, Member } = useSpeaker()

  const handleButtonClick = () => {
    if (isBoardMember) {
      setAssignRoleDialogOpen(true)
    } else {
      setSpeechDialogOpen(true)
    }
  }

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
            disabled={isAssigningRole || meetingIsReadOnly}
            onClick={handleButtonClick}
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

          <AssignRoleDialog
            open={assignRoleDialogOpen}
            defaultValue={profile?.id ?? ''}
            members={members}
            onClose={() => setAssignRoleDialogOpen(false)}
            onAssign={async ({ memberId }) => {
              await adminAssignRole({ memberId, meetingId, roleId: roleTypeId })
              setAssignRoleDialogOpen(false)
            }}
          />
        </>
      )}
    </>
  )
}

SpeakerBase.AddButtonOrAvatar = AddButtonOrAvatar
SpeakerBase.AddButtonOrAvatar.displayName = 'SpeakerBase.AddButtonOrAvatar'

const Information: React.FC = () => {
  const { roleStatus, RoleType, Member, Speech } = useSpeaker()

  return (
    <>
      <Text variant="h4">{RoleType.name}</Text>
      {roleStatus === 'UNASSIGNED' && (
        <Text variant="caption">Click to sign up</Text>
      )}
      {roleStatus === 'PENDING' && (
        <>
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

SpeakerBase.Information = Information
SpeakerBase.Information.displayName = 'SpeakerBase.Information'

const DeleteIcon: React.FC = () => {
  const { isBoardMember, memberUnassignRole, meetingId, meetingIsReadOnly } =
    useMeetingAgenda()
  const { memberId, roleTypeId, roleStatus } = useSpeaker()
  const { profile } = useAuth()

  const isMyRole = profile?.id === memberId
  const isConfirmedRole = roleStatus === 'CONFIRMED'

  if (!isBoardMember) return null
  if (!isMyRole) return null
  if (!isConfirmedRole) return null
  if (meetingIsReadOnly) return null

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

SpeakerBase.DeleteIcon = DeleteIcon
SpeakerBase.DeleteIcon.displayName = 'SpeakerBase.DeleteIcon'

const ApproveOrReject: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isBoardMember, meetingId, meetingIsReadOnly, approveSpeech } =
    useMeetingAgenda()
  const { roleStatus, Speech, memberId } = useSpeaker()
  const { profile } = useAuth()

  const toggleApproval = async (approved: boolean): Promise<void> => {
    setIsLoading(true)

    await approveSpeech({ meetingId, speechId: Speech!.id, approved })
    setIsLoading(false)
  }

  const isMyRole = profile?.id === memberId
  const isPending = roleStatus === 'PENDING'
  const speechIsAssigned = !!Speech

  if (!isBoardMember) return null
  if (isMyRole) return null
  if (!isPending) return null
  if (!speechIsAssigned) return null
  if (meetingIsReadOnly) return null

  return (
    <div className="flex space-x-4 mt-4">
      <Button
        color="secondary"
        loading={isLoading}
        onClick={() => toggleApproval(true)}
      >
        Approve
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        loading={isLoading}
        onClick={() => toggleApproval(false)}
      >
        Reject
      </Button>
    </div>
  )
}

SpeakerBase.ApproveOrReject = ApproveOrReject
SpeakerBase.ApproveOrReject.displayName = 'SpeakerBase.ApproveOrReject'

const AcceptOrDecline: React.FC = () => {
  const [speechDialogOpen, setSpeechDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { acceptAssignedRole, meetingId, meetingIsReadOnly } =
    useMeetingAgenda()
  const { id, RoleType, Speech, memberId, roleStatus } = useSpeaker()
  const { profile } = useAuth()

  const handleAccept = (): void => {
    const isAcceptingSpeech = RoleType.name.toLowerCase().includes('speaker')

    if (isAcceptingSpeech) {
      setSpeechDialogOpen(true)
    } else {
      setIsLoading(true)

      acceptAssignedRole({
        meetingId,
        roleId: id,
        accepted: true,
      }).finally(() => setIsLoading(false))
    }
  }

  const isMyRole = profile?.id === memberId
  const isPending = roleStatus === 'PENDING'
  const speechIsAssigned = !!Speech

  if (!isMyRole) return null
  if (!isPending) return null
  if (speechIsAssigned) return null
  if (meetingIsReadOnly) return null

  return (
    <>
      <div className="flex space-x-4 mt-4">
        <Button color="secondary" loading={isLoading} onClick={handleAccept}>
          Accept
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          loading={isLoading}
          onClick={() => {
            setIsLoading(true)

            acceptAssignedRole({
              meetingId,
              roleId: id,
              accepted: false,
            }).finally(() => setIsLoading(false))
          }}
        >
          Decline
        </Button>
      </div>

      <RequestSpeechDialog
        open={speechDialogOpen}
        isSubmitting={isLoading}
        onClose={() => setSpeechDialogOpen(false)}
        onRequest={async values => {
          setIsLoading(true)

          await acceptAssignedRole({
            meetingId,
            roleId: id,
            accepted: true,
            speech: values,
          })
          setIsLoading(false)
        }}
      />
    </>
  )
}

SpeakerBase.AcceptOrDecline = AcceptOrDecline
SpeakerBase.AcceptOrDecline.displayName = 'SpeakerBase.AcceptOrDecline'
