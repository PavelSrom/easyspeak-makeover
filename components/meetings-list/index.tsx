import { Paper } from '@mui/material'
import clsx from 'clsx'
import { MeetingCard } from 'components/meeting-card'
import { useRouter } from 'next/router'
import { UseQueryResult } from 'react-query'
import { Button, Text } from 'ui'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import { LoadingListItem } from 'ui/feedback/loadling-list-item'
import error from 'public/feedback-illustrations/error.svg'
import { useAuth } from 'contexts/auth'
import no_notifications from 'public/feedback-illustrations/no_notifications.svg'

export type MeetingListProps = {
  query: UseQueryResult<
    {
      id: string
      Club: {
        name: string
      }
      venue: string
      timeStart: Date
    }[],
    unknown
  >
  headline: string
  rangeIsChanged?: boolean
  onClick?: () => void
  className?: string
}

export const MeetingsList = ({
  query,
  headline,
  rangeIsChanged,
  onClick,
  className,
}: MeetingListProps) => {
  const router = useRouter()
  const { profile } = useAuth()
  return (
    <Paper className={`p-4 ${className}`}>
      <Text variant="h1_light" className="mb-4 onboarding-7">
        {headline}
      </Text>
      {query.isLoading && (
        <div className="flex flex-col gap-4">
          <LoadingListItem />
          <LoadingListItem />
          <LoadingListItem />
        </div>
      )}
      {query.isError && (
        <IllustrationFeedback
          title="Sorry!"
          message={`We couldn't find any meetings for ${
            profile?.User.Club.name || 'your club'
          }`}
          illustration={error}
        />
      )}
      {query.isSuccess &&
        query.data &&
        (query.data.length > 0 ? (
          <>
            {(query.data ?? []).map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onNavigate={() => router.push(`/meetings/${meeting.id}`)}
              />
            ))}
          </>
        ) : (
          <IllustrationFeedback
            title="No Meetings"
            message={
              rangeIsChanged
                ? `No ${headline}`
                : `${
                    profile?.User.Club.name || 'Your club'
                  } does not have any meetings yet `
            }
            illustration={no_notifications}
            illustrationStyles="w-1/2 sm:w-1/3"
          />
        ))}
      {onClick && (
        <div
          className={clsx('text-center width-full mt-2', {
            'opacity-0': !rangeIsChanged,
          })}
        >
          <Button variant="outlined" className="ml-auto" onClick={onClick}>
            Reset
          </Button>
        </div>
      )}
    </Paper>
  )
}
