import { Divider } from '@mui/material'
import { Text } from 'ui'
import { useMeetingAgenda } from 'contexts/meeting-agenda'
import { HelperBase } from './helper-components'

export const AgendaEvaluators = () => {
  const {
    agenda: { evaluators },
  } = useMeetingAgenda()

  if (evaluators.length === 0)
    return (
      <Text variant="body2" className="text-center">
        (No evaluators this meeting)
      </Text>
    )

  return (
    <>
      {evaluators.map(evaluator => (
        <HelperBase key={evaluator.id} helper={evaluator}>
          <div className="flex items-start">
            <div className="mr-4">
              <HelperBase.AddButtonOrAvatar />
            </div>
            <div className="flex-1">
              <HelperBase.Information />
              <HelperBase.AcceptOrDecline />
            </div>
            <HelperBase.DeleteIcon />
          </div>

          <Divider className="my-2" />
        </HelperBase>
      ))}
    </>
  )
}
