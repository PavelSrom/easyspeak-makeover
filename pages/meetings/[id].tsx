import { Container } from '@mui/material'
import { MeetingAgenda } from 'components/meeting-agenda'
import { MeetingDetails } from 'components/meeting-details'
import { useLayout } from 'contexts/page-layout'
import { useRouter } from 'next/router'
import { CustomNextPage } from 'types/helpers'

const Meeting: CustomNextPage = () => {
  const router = useRouter()
  const { activeTab } = useLayout()

  return (
    <Container className="py-4">
      {activeTab === 0 && (
        <MeetingDetails meetingId={router.query.id as string} />
      )}
      {activeTab === 1 && (
        <MeetingAgenda meetingId={router.query.id as string} />
      )}
    </Container>
  )
}

Meeting.pageTitle = 'Meeting'
Meeting.tabs = ['Details', 'Agenda']

export default Meeting
