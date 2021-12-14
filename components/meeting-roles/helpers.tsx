import { Divider } from '@mui/material'
import { Text } from 'ui'
import { useMeetingAgenda } from 'contexts/meeting-agenda'
import { HelperBase } from './helper-components'

export const AgendaHelpers = () => {
  const {
    agenda: { helpers },
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
        <HelperBase key={helper.id} helper={helper}>
          <div className="flex items-start">
            <div className="mr-4">
              <HelperBase.AddButtonOrAvatar />
            </div>
            <div className="flex-1">
              <HelperBase.Information />
            </div>
            <HelperBase.DeleteIcon />
          </div>

          <Divider className="my-2" />
        </HelperBase>
      ))}
    </>
  )
}
