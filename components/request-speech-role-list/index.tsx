import { Divider, Paper } from '@mui/material'
import { useTypeSafeQuery } from 'hooks'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import { LoadingListItem } from 'ui/feedback/loadling-list-item'
import error from 'public/feedback-illustrations/error.svg'
import { useAuth } from 'contexts/auth'
import { DashboardDTO } from 'types/api'
import { SpeakerBase } from 'components/meeting-roles/speaker-components'
import calendar from 'public/feedback-illustrations/calendar.svg'
import { HelperBase } from 'components/meeting-roles/helper-components'
import { Text } from 'ui'

const RequestedSpeechItem = (
  requestedSpeeches: DashboardDTO['requestedSpeeches']
) => {
  if (requestedSpeeches?.length > 0) {
    return (
      <>
        <Text variant="h1_light">Requested speeches</Text>
        <Text variant="body" className="mb-4">
          Following members has requested speeches <br />
          (You need to go to the meeting to accept)
        </Text>
        {requestedSpeeches!.map(speaker => (
          <SpeakerBase key={speaker.id} speaker={speaker}>
            <div className="flex items-start">
              <div className="mr-4">
                <SpeakerBase.AddButtonOrAvatar />
              </div>
              <div className="flex-1">
                <SpeakerBase.Information />
                <SpeakerBase.ApproveOrReject />
                <SpeakerBase.AcceptOrDecline />
              </div>
              <SpeakerBase.DeleteIcon />
            </div>

            <Divider className="my-2" />
          </SpeakerBase>
        ))}
      </>
    )
  }
  return (
    <IllustrationFeedback
      title="You are up to date"
      message="You haven't got any speech requests waiting for your answer"
      illustration={calendar}
    />
  )
}

const RequestedRoles = (requestedRoles: DashboardDTO['requestedRoles']) => {
  if (requestedRoles?.length > 0) {
    return (
      <>
        <Text variant="h1_light">Requested roles</Text>
        <Text variant="body" className="mb-4">
          You have been requested to optain following roles <br />
          (You need to go to the meeting to confirm)
        </Text>
        {requestedRoles!.map(role => (
          <HelperBase key={role.id} helper={role}>
            <div className="flex items-start">
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
    // return <Text>SOME HELP HERE PLEASE</Text>
  }
  return (
    <IllustrationFeedback
      title="You are up to date"
      message="You haven't got any meeting role requests waiting for your answer"
      illustration={calendar}
    />
  )
}

export const RequestSpeechOrRoleList = () => {
  const query = useTypeSafeQuery('getDashboard')
  const { profile } = useAuth()

  return (
    <Paper className="p-4">
      {query.isLoading && (
        <div className="flex flex-col gap-4">
          <LoadingListItem />
          <LoadingListItem />
        </div>
      )}
      {query.isError && (
        <IllustrationFeedback
          title="Sorry!"
          message={`Something went wrong, we couldn't find ${
            profile?.roleTypeId ? 'the Requested speeches' : 'Requested roles'
          }`}
          illustration={error}
        />
      )}
      {query.isSuccess &&
        query.data &&
        (profile?.roleTypeId
          ? RequestedSpeechItem(query.data.requestedSpeeches)
          : RequestedRoles(query.data.requestedRoles))}
    </Paper>
  )
}
