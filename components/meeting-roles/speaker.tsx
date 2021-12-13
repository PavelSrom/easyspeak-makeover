import AddOutlined from '@mui/icons-material/AddOutlined'
import Delete from '@mui/icons-material/Delete'
import { Avatar, Divider, Fab, IconButton } from '@mui/material'
import { RequestSpeechDialog } from 'components/request-speech-dialog'
import { useState } from 'react'
import { AgendaFullDTO } from 'types/api'
import { Text } from 'ui'

type Props = {
  speaker: AgendaFullDTO['speakers'][number]
  onAssign: (values: { title: string; description: string }) => void
  onUnassign: () => void
  isLoading: boolean
}

export const MeetingRoleSpeaker = ({
  speaker,
  onAssign,
  onUnassign,
  isLoading,
}: Props) => {
  const [speechDialogOpen, setSpeechDialogOpen] = useState<boolean>(false)

  const layoutWhenConfirmed = (
    <>
      <Avatar src={speaker.Member?.avatar ?? ''} className="w-10 h-10 mr-4" />
      <div className="flex-1">
        <Text variant="h4">{speaker.RoleType.name}</Text>
        <Text variant="caption">
          {`${speaker.Member?.name} ${speaker.Member?.surname}`}
        </Text>

        <div className="mt-2">
          <Text variant="body2" className="font-semibold">
            {speaker.Speech?.title ?? '(No speech title)'}
          </Text>
          <Text variant="small">
            {speaker.Speech?.description ?? '(No speech description)'}
          </Text>
        </div>
      </div>
      {/* TODO: delete icons only for admins or how we handle this? */}
      <IconButton size="small" edge="end" onClick={onUnassign}>
        <Delete />
      </IconButton>
    </>
  )

  const layoutWhenPending = (
    <>
      <Avatar src={speaker.Member?.avatar ?? ''} className="w-10 h-10 mr-4" />
      <div className="flex-1">
        <Text variant="h4">{speaker.RoleType.name}</Text>
        <Text variant="caption">
          {`${speaker.Member?.name} ${speaker.Member?.surname}`} (pending)
        </Text>

        <div className="mt-2">
          <Text variant="body2" className="font-semibold">
            {speaker.Speech?.title}
          </Text>
          <Text variant="small">{speaker.Speech?.description}</Text>
        </div>
      </div>
      {/* TODO: delete icons only for admins or how we handle this? */}
      <IconButton size="small" edge="end" onClick={onUnassign}>
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
        onClick={() => setSpeechDialogOpen(true)}
      >
        <AddOutlined />
      </Fab>
      <div className="flex-1">
        <Text variant="h4">{speaker.RoleType.name}</Text>
        <Text variant="caption">Click to sign up</Text>
      </div>

      <RequestSpeechDialog
        open={speechDialogOpen}
        isSubmitting={isLoading}
        onClose={() => setSpeechDialogOpen(false)}
        onRequest={onAssign}
      />
    </>
  )

  return (
    <>
      <div className="flex items-start">
        {speaker.roleStatus === 'CONFIRMED' && layoutWhenConfirmed}
        {speaker.roleStatus === 'PENDING' && layoutWhenPending}
        {speaker.roleStatus === 'UNASSIGNED' && layoutWhenUnassigned}
      </div>

      <Divider className="my-2" />
    </>
  )
}
