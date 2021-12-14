import { Divider } from '@mui/material'
import { useMeetingAgenda } from 'contexts/meeting-agenda'
import { Text } from 'ui'
import { SpeakerItemBase } from './speaker-components'

export const AgendaSpeakers = () => {
  const {
    agenda: { speakers },
  } = useMeetingAgenda()

  if (speakers.length === 0)
    return (
      <Text variant="body2" className="text-center">
        (No speakers this meeting)
      </Text>
    )

  return (
    <>
      {speakers.map(speaker => (
        <SpeakerItemBase speaker={speaker}>
          <div className="flex items-start">
            <div className="mr-4">
              <SpeakerItemBase.AddButtonOrAvatar />
            </div>
            <div className="flex-1">
              <SpeakerItemBase.Information />
            </div>
            <SpeakerItemBase.DeleteIcon />
          </div>

          <Divider className="my-2" />
        </SpeakerItemBase>
      ))}
    </>
  )
}
