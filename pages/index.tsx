import { Container, Divider, Paper } from '@mui/material'
import { ClubInfo } from 'components/club/club-info'
import { MeetingCard } from 'components/meeting-card'
import { SpeakerBase } from 'components/meeting-roles/speaker-components'
import { PostCard } from 'components/post-card'
import { useAuth } from 'contexts/auth'
import { add, startOfToday } from 'date-fns'
import { CustomNextPage } from 'types/helpers'
import { Text } from 'ui'
import { ReadMoreCaption } from 'ui/read-more-caption'
import { withAuth } from 'utils/with-auth'
import { useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import error from 'public/feedback-illustrations/error.svg'
import no_pinned_post from 'public/feedback-illustrations/no_pinned_post.svg'
import calendar from 'public/feedback-illustrations/calendar.svg'
import { MeetingsList } from 'components/meetings-list'
import { LoadingPostItem } from 'ui/feedback/loading-post-item'
import { LoadingListItem } from 'ui/feedback/loadling-list-item'

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

  const dashboardDataQuery = useTypeSafeQuery('getDashboard')

  return (
    <Container className="onboarding-1 py-4 grid gap-4 grid-cols-1 md:grid-cols-2">
      <ReadMoreCaption
        captionText="About club"
        onNavigate={() => router.push(`/club`)}
      >
        <ClubInfo />
      </ReadMoreCaption>
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
          <>
            {pinnedPostQuery.data ? (
              pinnedPostQuery.data.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onNavigate={() =>
                    router.push(`/discussion/${dashboardDataQuery.data!.id}`)
                  }
                />
              ))
            ) : (
              <IllustrationFeedback
                title="No pinned post"
                message="There isn't pinned an important post in your club yet"
                illustration={no_pinned_post}
              />
            )}
          </>
        )}
      </ReadMoreCaption>
      <ReadMoreCaption
        captionText={
          profile?.roleTypeId ? 'Requested speeches' : 'Requested roles'
        }
      >
        <Paper className="p-4">
          {dashboardDataQuery.isLoading && (
            <div className="flex flex-col gap-4">
              <LoadingListItem />
              <LoadingListItem />
            </div>
          )}
          {dashboardDataQuery.isError && (
            <IllustrationFeedback
              title="Sorry!"
              message={`Something went wrong, we couldn't find ${
                profile?.roleTypeId
                  ? 'the Requested speeches'
                  : 'Requested roles'
              }`}
              illustration={error}
            />
          )}
          {dashboardDataQuery.isSuccess &&
            dashboardDataQuery.data &&
            (profile?.roleTypeId ? (
              dashboardDataQuery.data.requestedRoles.map(speaker => (
                // @ts-ignore
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
              ))
            ) : (
              <Text>Normal member</Text>
            ))}
        </Paper>
      </ReadMoreCaption>
    </Container>
  )
}

Dashboard.pageTitle = 'Dashboard'

export default Dashboard
