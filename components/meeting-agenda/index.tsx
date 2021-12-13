import { Paper } from '@mui/material'
import { Text } from 'ui'
import { AgendaSpeakers } from 'components/meeting-roles/speakers'
import { AgendaEvaluators } from 'components/meeting-roles/evaluators'
import { AgendaHelpers } from 'components/meeting-roles/helpers'
import { MeetingAgendaProvider } from 'contexts/meeting-agenda'

export const MeetingAgenda = () => (
  <MeetingAgendaProvider>
    <Paper className="p-4">
      <Text variant="h1_light" className="mb-4">
        Speakers
      </Text>
      <AgendaSpeakers />

      <Text variant="h1_light" className="my-4">
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
