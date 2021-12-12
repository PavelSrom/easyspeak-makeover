import { Avatar, Divider, IconButton, Paper } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import { useTypeSafeQuery } from 'hooks'
import { Text } from 'ui'
import { Fragment } from 'react'

type Props = {
  meetingId: string
}

export const MeetingAgenda = ({ meetingId }: Props) => {
  const agendaQuery = useTypeSafeQuery(
    ['getFullAgenda', meetingId],
    { enabled: !!meetingId },
    meetingId
  )
  console.log(agendaQuery.data)

  if (agendaQuery.isLoading) return <p>Loading...</p>
  if (agendaQuery.isError || !agendaQuery.data) return <p>Error!</p>

  return (
    <>
      <Paper className="p-4">
        <Text variant="h1_light" className="mb-4">
          Speakers
        </Text>
        {agendaQuery.data.speakers.map(speaker => (
          <Fragment key={speaker.id}>
            <div className="flex items-start">
              <Avatar
                src={speaker.Member?.avatar ?? ''}
                className="w-10 h-10 mr-4"
              />
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
          </Fragment>
        ))}

        <Text variant="h1_light" className="my-4">
          Evaluators
        </Text>
        {agendaQuery.data.evaluators.map(evaluator => (
          <Fragment key={evaluator.id}>
            <div className="flex items-start">
              <Avatar
                src={evaluator.Member?.avatar ?? ''}
                className="w-10 h-10 mr-4"
              />
              <div className="flex-1">
                <Text variant="h4">{evaluator.RoleType.name}</Text>
                <Text variant="caption">
                  {' '}
                  {evaluator.Member
                    ? `${evaluator.Member?.name} ${evaluator.Member?.surname}`
                    : 'Click to sign up'}
                </Text>
              </div>
              <IconButton size="small" edge="end">
                <Delete />
              </IconButton>
            </div>

            <Divider className="my-2" />
          </Fragment>
        ))}

        <Text variant="h1_light" className="my-4">
          Helpers
        </Text>
        {agendaQuery.data.helpers.map(helper => (
          <Fragment key={helper.id}>
            <div className="flex items-start">
              <Avatar
                src={helper.Member?.avatar ?? ''}
                className="w-10 h-10 mr-4"
              />
              <div className="flex-1">
                <Text variant="h4">{helper.RoleType.name}</Text>
                <Text variant="caption">
                  {' '}
                  {helper.Member
                    ? `${helper.Member?.name} ${helper.Member?.surname}`
                    : 'Click to sign up'}
                </Text>
              </div>
              <IconButton size="small" edge="end">
                <Delete />
              </IconButton>
            </div>

            <Divider className="my-2" />
          </Fragment>
        ))}
      </Paper>
    </>
  )
}
