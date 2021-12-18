import { Container, Paper } from '@mui/material'
import { ClubInfo } from 'components/club/club-info'
import { PostCard } from 'components/post-card'
import { useAuth } from 'contexts/auth'
import { add, startOfToday } from 'date-fns'
import { CustomNextPage } from 'types/helpers'
import { ReadMoreCaption } from 'ui/read-more-caption'
import { withAuth } from 'utils/with-auth'
import { useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import error from 'public/feedback-illustrations/error.svg'
import no_pinned_post from 'public/feedback-illustrations/no_pinned_post.svg'
import { MeetingsList } from 'components/meetings-list'
import { LoadingPostItem } from 'ui/feedback/loading-post-item'
import { RequestSpeechOrRoleList } from 'components/request-speech-role-list'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Dashboard: CustomNextPage = () => {
  const { profile } = useAuth()
  const router = useRouter()
  const listRange = {
    start: startOfToday().toISOString(),
    end: add(startOfToday(), { months: 1 }).toISOString(),
  }
  const meetingListQuery = useTypeSafeQuery(
    ['getAllMeetings', listRange.start, listRange.end],
    null,
    { timeStart: listRange.start, timeEnd: listRange.end }
  )

  const pinnedPostQuery = useTypeSafeQuery(['getAllPosts', 'isPinned'], null, {
    isPinned: true,
  })

  return (
    <Container className="py-4 h-full grid gap-4 grid-cols-1 md:grid-cols-2">
      <div className="onboarding-1">
        <ReadMoreCaption
          captionText="About club"
          onNavigate={() => router.push(`/club`)}
        >
          <ClubInfo />
        </ReadMoreCaption>
      </div>
      <ReadMoreCaption
        captionText="Next meetings"
        onNavigate={() => router.push(`/meetings`)}
      >
        <MeetingsList query={meetingListQuery} headline="Next meetings" />
      </ReadMoreCaption>
      <ReadMoreCaption
        captionText="Pinned post"
        onNavigate={() => router.push(`/discussion`)}
      >
        {pinnedPostQuery.isLoading && (
          <Paper className="p-4">
            <LoadingPostItem />
          </Paper>
        )}
        {pinnedPostQuery.isError && (
          <Paper className="p-4">
            <IllustrationFeedback
              title="Sorry!"
              message={`Something went wrong, we couldn't find the pinned post from ${
                profile?.User.Club.name || 'your club'
              }`}
              illustration={error}
            />
          </Paper>
        )}
        {pinnedPostQuery.isSuccess && (
          <Paper className="p-4">
            {pinnedPostQuery.data.length > 0 ? (
              pinnedPostQuery.data.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onNavigate={() => router.push(`/discussion/${post.id}`)}
                />
              ))
            ) : (
              <IllustrationFeedback
                title="No pinned post"
                message="There isn't pinned an important post in your club yet"
                illustration={no_pinned_post}
              />
            )}
          </Paper>
        )}
      </ReadMoreCaption>
      <ReadMoreCaption
        captionText={
          profile?.roleTypeId ? 'Requested speeches' : 'Requested roles'
        }
      >
        <RequestSpeechOrRoleList />
      </ReadMoreCaption>
    </Container>
  )
}

Dashboard.pageTitle = 'Dashboard'

export default Dashboard
