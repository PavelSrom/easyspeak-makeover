import { Container, Divider, Paper } from '@mui/material'
import { ClubInfo } from 'components/club/club-info'
import { MeetingCard } from 'components/meeting-card'
import { SpeakerBase } from 'components/meeting-roles/speaker-components'
import { PostCard } from 'components/post-card'
import { useAuth } from 'contexts/auth'
import { add, startOfToday } from 'date-fns'
import { useTypeSafeQuery } from 'hooks'
import router from 'next/router'
import { CustomNextPage } from 'types/helpers'
import { Text } from 'ui'
import { ReadMoreCaption } from 'ui/read-more-caption'
import { withAuth } from 'utils/with-auth'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Dashboard: CustomNextPage = () => {
  const { profile } = useAuth()
  const listRange = {
    start: startOfToday().toISOString(),
    end: add(startOfToday(), { months: 1 }).toISOString(),
  }
  const meetingListQuery = useTypeSafeQuery(
    ['getAllMeetings', listRange.start, listRange.end],
    null,
    { timeStart: listRange.start, timeEnd: listRange.end }
  )

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
        {meetingListQuery.isLoading && (
          /* spinner or skeletons */ <p>Loading...</p>
        )}
        {meetingListQuery.isError && /* error UI */ <p>Error!</p>}
        {meetingListQuery.isSuccess && meetingListQuery.data && (
          <Paper className="p-4">
            {meetingListQuery.data ? (
              (meetingListQuery.data ?? []).map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onNavigate={() => router.push(`/meetings/${meeting.id}`)}
                />
              ))
            ) : (
              // TODO: A better message for the user
              <Text>No meetings is found</Text>
            )}
          </Paper>
        )}
      </ReadMoreCaption>
      <ReadMoreCaption
        captionText="Pinned post"
        onNavigate={() => router.push(`/discussion`)}
      >
        {dashboardDataQuery.isLoading && (
          /* spinner or skeletons */ <p>Loading...</p>
        )}
        {dashboardDataQuery.isError && /* error UI */ <p>Error!</p>}
        {dashboardDataQuery.isSuccess && dashboardDataQuery.data && (
          <>
            {dashboardDataQuery.data.pinnedPost ? (
              <PostCard
                key={dashboardDataQuery.data.pinnedPost.id}
                post={dashboardDataQuery.data.pinnedPost}
                onNavigate={() =>
                  router.push(
                    `/discussion/${dashboardDataQuery.data.pinnedPost.id}`
                  )
                }
              />
            ) : (
              <p>No posts have been added yet</p>
            )}
          </>
        )}
      </ReadMoreCaption>
      <ReadMoreCaption
        captionText={
          profile?.roleTypeId ? 'Requested speeches' : 'Requested roles'
        }
      >
        {dashboardDataQuery.isLoading && (
          /* spinner or skeletons */ <p>Loading...</p>
        )}
        {dashboardDataQuery.isError && /* error UI */ <p>Error!</p>}
        {dashboardDataQuery.isSuccess && dashboardDataQuery.data && (
          <Paper className="p-4">
            {profile?.roleTypeId ? (
              dashboardDataQuery.data.requestedItems.map(speaker => (
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
            )}
          </Paper>
        )}
      </ReadMoreCaption>
    </Container>
  )
}

Dashboard.pageTitle = 'Dashboard'

export default Dashboard
