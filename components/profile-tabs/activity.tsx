/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Divider, Paper } from '@mui/material'
import { MeetingCard } from 'components/meeting-card'
import { useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { Text } from 'ui'

export const ProfileActivity = () => {
  const router = useRouter()

  const activityQuery = useTypeSafeQuery('getUserActivity')

  if (activityQuery.isLoading) return <p>Loading...</p>
  if (activityQuery.isError || !activityQuery.data) return <p>Error!</p>

  const { meetings, posts } = activityQuery.data

  return (
    <>
      <Paper className="p-4">
        <Text variant="h1_light" className="mb-4">
          Next meetings
        </Text>
        {meetings.length > 0 ? (
          <div className="divide-y-2">
            {meetings.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onNavigate={() => router.push(`/meetings/${meeting.id}`)}
              />
            ))}
          </div>
        ) : (
          <Text className="text-center">(There are no meetings yet)</Text>
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
              >
                <Text variant="h1">{post.title}</Text>
                <Text>{post.body.slice(0, 250)}</Text>
              </div>

              <Divider className="my-4" />
            </>
          ))
        ) : (
          <Text className="text-center">(You have no posts yet)</Text>
        )}
      </Paper>
    </>
  )
}
