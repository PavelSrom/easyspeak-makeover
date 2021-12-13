import Delete from '@mui/icons-material/Delete'
import AddOutlined from '@mui/icons-material/AddOutlined'
import { Avatar, Divider, Fab, IconButton } from '@mui/material'
import { AgendaFullDTO } from 'types/api'
import { Text } from 'ui'
import { useMeetingAgenda } from 'contexts/meeting-agenda'

type Props = {
  evaluator: AgendaFullDTO['evaluators'][number]
  onAssign: () => void
  onUnassign: () => void
  isLoading: boolean
}

const MeetingRoleEvaluator = ({
  evaluator,
  onAssign,
  onUnassign,
  isLoading,
}: Props) => {
  const layoutWhenConfirmed = (
    <>
      <Avatar src={evaluator.Member?.avatar ?? ''} className="w-10 h-10 mr-4" />
      <div className="flex-1">
        <Text variant="h4">{evaluator.RoleType.name}</Text>
        <Text variant="caption">
          {`${evaluator.Member?.name} ${evaluator.Member?.surname}`}
        </Text>
      </div>
      <IconButton
        size="small"
        edge="end"
        disabled={isLoading}
        onClick={onUnassign}
      >
        <Delete />
      </IconButton>
    </>
  )

  const layoutWhenPending = (
    <>
      <Avatar src={evaluator.Member?.avatar ?? ''} className="w-10 h-10 mr-4" />
      <div className="flex-1">
        <Text variant="h4">{evaluator.RoleType.name}</Text>
        <Text variant="caption">
          {`${evaluator.Member?.name} ${evaluator.Member?.surname}`} (pending)
        </Text>
      </div>
      <IconButton size="small" edge="end">
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
        onClick={onAssign}
      >
        <AddOutlined />
      </Fab>
      <div className="flex-1">
        <Text variant="h4">{evaluator.RoleType.name}</Text>
        <Text variant="caption">Click to sign up</Text>
      </div>
    </>
  )

  return (
    <>
      <div className="flex items-start">
        {evaluator.roleStatus === 'CONFIRMED' && layoutWhenConfirmed}
        {evaluator.roleStatus === 'PENDING' && layoutWhenPending}
        {evaluator.roleStatus === 'UNASSIGNED' && layoutWhenUnassigned}
      </div>

      <Divider className="my-2" />
    </>
  )
}

export const AgendaEvaluators = () => {
  const {
    agenda: { evaluators },
    meetingId,
    isAssigningRole,
    memberAssignRole,
    memberUnassignRole,
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
        <MeetingRoleEvaluator
          key={evaluator.id}
          evaluator={evaluator}
          isLoading={isAssigningRole}
          onAssign={() =>
            memberAssignRole({
              meetingId,
              roleId: evaluator.roleTypeId,
            })
          }
          onUnassign={() =>
            memberUnassignRole({ meetingId, roleId: evaluator.roleTypeId })
          }
        />
      ))}
    </>
  )
}