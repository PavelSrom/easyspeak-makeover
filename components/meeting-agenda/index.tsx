import { Paper } from '@mui/material'
import { Text } from 'ui'
import { AgendaSpeakers } from 'components/meeting-roles/speakers'
import { AgendaEvaluators } from 'components/meeting-roles/evaluators'
import { AgendaHelpers } from 'components/meeting-roles/helpers'
import { MeetingAgendaProvider } from 'contexts/meeting-agenda'

type Props = {
  meetingStart: Date
}

export const MeetingAgenda = ({ meetingStart }: Props) => (
  <MeetingAgendaProvider meetingStart={meetingStart}>
    <Paper className="p-4 onboarding-9">
      <Text variant="h1_light" className="mb-4 onboarding-10">
        Speakers
      </Text>
      <AgendaSpeakers />

      <Text variant="h1_light" className="my-4 onboarding-11">
        Evaluators
      </Text>
      <AgendaEvaluators />

      <Text variant="h1_light" className="my-4">
        Helpers
      </Text>
      <AgendaHelpers />
    </Paper>
  </MeetingAgendaProvider>
)
