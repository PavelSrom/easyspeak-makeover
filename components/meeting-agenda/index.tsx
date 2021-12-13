import { Paper } from '@mui/material'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { Text } from 'ui'
import { MeetingRoleSpeaker } from 'components/meeting-roles/speaker'
import { MeetingRoleEvaluator } from 'components/meeting-roles/evaluator'
import { MeetingRoleHelper } from 'components/meeting-roles/helper'

type Props = {
  meetingId: string
}

export const MeetingAgenda = ({ meetingId }: Props) => {
  const queryClient = useTypeSafeQueryClient()

  const agendaQuery = useTypeSafeQuery(
    ['getFullAgenda', meetingId],
    { enabled: !!meetingId },
    meetingId
  )
  console.log(agendaQuery.data)

  const { mutateAsync: memberAssignRole, isLoading: isAssigningMemberRole } =
    useTypeSafeMutation('memberAssignRole', {
      onSettled: () => {
        queryClient.invalidateQueries('getFullAgenda')
      },
    })
  const {
    mutateAsync: memberUnassignRole,
    isLoading: isUnassigningMemberRole,
  } = useTypeSafeMutation('memberUnassignRole', {
    onSettled: () => {
      queryClient.invalidateQueries('getFullAgenda')
    },
  })

  if (agendaQuery.isLoading) return <p>Loading...</p>
  if (agendaQuery.isError || !agendaQuery.data) return <p>Error!</p>

  return (
    <>
      <Paper className="p-4">
        <Text variant="h1_light" className="mb-4">
          Speakers
        </Text>
        {agendaQuery.data.speakers.map(speaker => (
          <MeetingRoleSpeaker
            key={speaker.id}
            speaker={speaker}
            isLoading={isAssigningMemberRole || isUnassigningMemberRole}
            onAssign={speechData =>
              memberAssignRole([
                { meetingId, roleId: speaker.roleTypeId, ...speechData },
              ])
            }
            onUnassign={() =>
              memberUnassignRole([{ meetingId, roleId: speaker.roleTypeId }])
            }
          />
        ))}

        <Text variant="h1_light" className="my-4">
          Evaluators
        </Text>
        {agendaQuery.data.evaluators.map(evaluator => (
          <MeetingRoleEvaluator
            key={evaluator.id}
            evaluator={evaluator}
            isLoading={isAssigningMemberRole || isUnassigningMemberRole}
            onAssign={() =>
              memberAssignRole([{ meetingId, roleId: evaluator.roleTypeId }])
            }
            onUnassign={() =>
              memberUnassignRole([{ meetingId, roleId: evaluator.roleTypeId }])
            }
          />
        ))}

        <Text variant="h1_light" className="my-4">
          Helpers
        </Text>
        {agendaQuery.data.helpers.map(helper => (
          <MeetingRoleHelper
            key={helper.id}
            helper={helper}
            isLoading={isAssigningMemberRole || isUnassigningMemberRole}
            onAssign={() =>
              memberAssignRole([{ meetingId, roleId: helper.roleTypeId }])
            }
            onUnassign={() =>
              memberUnassignRole([{ meetingId, roleId: helper.roleTypeId }])
            }
          />
        ))}
      </Paper>
    </>
  )
}
