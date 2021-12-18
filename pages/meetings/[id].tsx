import { CircularProgress, Container } from '@mui/material'
import { MeetingAgenda } from 'components/meeting-agenda'
import { MeetingDetails } from 'components/meeting-details'
import { useLayout } from 'contexts/page-layout'
import { useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { CustomNextPage } from 'types/helpers'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import error from 'public/feedback-illustrations/error.svg'

const Meeting: CustomNextPage = () => {
  const router = useRouter()
  const { activeTab } = useLayout()

  const meetingDetailsQuery = useTypeSafeQuery(
    ['getMeetingById', router.query.id as string],
    { enabled: !!router.query.id },
    router.query.id as string
  )

  if (meetingDetailsQuery.isLoading)
    return (
      <Container className="py-4 text-center">
        <CircularProgress color="primary" />
      </Container>
    )
  if (meetingDetailsQuery.isError || !meetingDetailsQuery.data)
    return (
      <Container className="py-4">
        <IllustrationFeedback
          title="Sorry!"
          message={`Something went wrong, we couldn't find this meeting`}
          illustration={error}
        />
      </Container>
    )

  return (
    <Container className="py-4">
      {activeTab === 0 && <MeetingDetails meeting={meetingDetailsQuery.data} />}
      {activeTab === 1 && (
        <MeetingAgenda meetingStart={meetingDetailsQuery.data.timeStart} />
      )}
    </Container>
  )
}

Meeting.pageTitle = 'Meeting'
Meeting.tabs = ['Details', 'Agenda']

export default Meeting
