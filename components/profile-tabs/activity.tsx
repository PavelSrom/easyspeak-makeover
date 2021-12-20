/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Divider, Paper, Skeleton } from '@mui/material'
import { MeetingCard } from 'components/meeting-card'
import { useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { Text } from 'ui'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import { LoadingListItem } from 'ui/feedback/loadling-list-item'
import error from 'public/feedback-illustrations/error.svg'
import connection from 'public/feedback-illustrations/connection.svg'
import no_notifications from 'public/feedback-illustrations/no_notifications.svg'
import { useAuth } from 'contexts/auth'

export const ProfileActivity = () => {
  const router = useRouter()
  const profile = useAuth()

  const activityQuery = useTypeSafeQuery('getUserActivity')

  if (activityQuery.isLoading)
    return (
      <>
        <Paper className="p-4">
          <Text variant="h1_light" className="mb-4">
            Next meetings
          </Text>
          <LoadingListItem />
        </Paper>
        <Paper className="mt-4 p-4">
          <Text variant="h1_light" className="mb-4">
            Your posts
          </Text>
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={24} />
          <Divider />
        </Paper>
      </>
    )

  if (activityQuery.isError || !activityQuery.data)
    return (
      <IllustrationFeedback
        title="We couldn't find the comments!"
        message="Something went wrong, we couldn't find the comments for this post."
        illustration={error}
      />
    )

  const { meetings, posts } = activityQuery.data

  return (
    <>
      <Paper className="p-4">
        <Text variant="h1_light" className="mb-4">
          Next meetings
        </Text>
        {meetings.length > 0 ? (
          meetings.map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onNavigate={() => router.push(`/meetings/${meeting.id}`)}
            />
          ))
        ) : (
          <IllustrationFeedback
            title="No Meetings"
            message={`${
              profile.profile?.User.Club.name || 'Your club'
            } does not have any meetings yet `}
            illustration={no_notifications}
            illustrationStyles="w-1/2 sm:w-1/3"
          />
        )}
      </Paper>

      <Paper className="mt-4 p-4">
        <Text variant="h1_light" className="mb-4">
          Your posts
        </Text>

        {posts.length > 0 ? (
          posts.map(post => (
            <>
              <div
                key={post.id}
                onClick={() => router.push(`/discussion/${post.id}`)}
                className="cursor-pointer hover:opacity-75"
              >
                <Text variant="h1">{post.title}</Text>
                <Text>{post.body.slice(0, 250)}</Text>

                <Divider className="my-4" />
              </div>
            </>
          ))
        ) : (
          <IllustrationFeedback
            title="You have no posts"
            message="Go to the discussion forum to create your first post and connect with other members in the club"
            illustration={connection}
            illustrationStyles="w-1/2 sm:w-1/3"
            onNavigate={() => router.push('/discussion')}
            buttonText="Go to discussion forum"
          />
        )}
      </Paper>
    </>
  )
}
