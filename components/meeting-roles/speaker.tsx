import Delete from '@mui/icons-material/Delete'
import { Avatar, Divider, IconButton } from '@mui/material'
import { AgendaFullDTO } from 'types/api'
import { Text } from 'ui'

type Props = {
  speaker: AgendaFullDTO['speakers'][number]
}

export const MeetingRoleSpeaker = ({ speaker }: Props) => {
  console.log('hello')

  return (
    <>
      <div className="flex items-start">
        <Avatar src={speaker.Member?.avatar ?? ''} className="w-10 h-10 mr-4" />
        <div className="flex-1">
          <Text variant="h4">{speaker.RoleType.name}</Text>
          <Text variant="caption">
            {speaker.Member
              ? `${speaker.Member?.name} ${speaker.Member?.surname}`
              : 'Click to sign up'}
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
        <IconButton size="small" edge="end">
          <Delete />
        </IconButton>
      </div>

      <Divider className="my-2" />
    </>
  )
}
