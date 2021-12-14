import { Container } from '@mui/material'
import { ClubInfo } from 'components/club/club-info'
import { CustomNextPage } from 'types/helpers'
import { ReadMoreCaption } from 'ui/read-more-caption'
import { withAuth } from 'utils/with-auth'
import { useTypeSafeQuery } from 'hooks'
import { MeetingCard } from 'components/meeting-card'
import { add } from 'date-fns'
import { useRouter } from 'next/router'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Dashboard: CustomNextPage = () => {
  const router = useRouter()
  const now = new Date()
  const yearFromNow = add(new Date(), { years: 1 })
  // const nextMeeting = useTypeSafeQuery(['getAllMeetings', {orderBy: 'timeStart'}], null, {timeStart: )
  const nextMeetingQuery = useTypeSafeQuery(
    ['getAllMeetings', now.toISOString(), yearFromNow.toISOString()],
    null,
    { timeStart: now.toISOString(), timeEnd: yearFromNow.toISOString() }
  )
  return (
    <Container className="py-4 grid gap-4 grid-cols-1 md:grid-cols-2">
      <ReadMoreCaption captionText="About club" href="/club/">
        <ClubInfo />
      </ReadMoreCaption>
      <ReadMoreCaption captionText="Next meeting" href="">
        {(nextMeetingQuery.data ?? []).map(meeting => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            onNavigate={() => router.push(`/meetings/${meeting.id}`)}
          />
        ))}
      </ReadMoreCaption>
      <ReadMoreCaption captionText="Pinned post" href="">
        {/* Add something here */}
      </ReadMoreCaption>
    </Container>
  )
}

Dashboard.pageTitle = 'Dashboard'

export default Dashboard
