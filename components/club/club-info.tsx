import { Paper } from '@mui/material'
import LocationOn from '@mui/icons-material/LocationOn'
import Description from '@mui/icons-material/Description'
import { Text } from 'ui'
import { useTypeSafeQuery } from 'hooks'
import { useOnboarding } from 'contexts/onboarding'
import { LoadingClubInfo } from 'ui/feedback/loading-club-info'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import error from 'public/feedback-illustrations/error.svg'
import { useAuth } from 'contexts/auth'

export const ClubInfo = () => {
  const clubInfoQuery = useTypeSafeQuery('getClubInfo')
  const { profile } = useAuth()
  useOnboarding({ shown: !!clubInfoQuery.data && clubInfoQuery.isSuccess })

  if (clubInfoQuery.isLoading)
    return (
      <Paper className="p-4 space-y-4 onboarding-5">
        <LoadingClubInfo />
      </Paper>
    )
  if (clubInfoQuery.isError || !clubInfoQuery.data)
    return (
      <Paper className="p-4 space-y-4 onboarding-5">
        <IllustrationFeedback
          title="Sorry!"
          message={`Something went wrong, we couldn't find the details for ${
            profile?.User.Club.name || 'your club'
          }`}
          illustration={error}
        />
      </Paper>
    )

  return (
    <Paper className="p-4 space-y-4 onboarding-5">
      <Text variant="h1_light">{clubInfoQuery.data.name}</Text>
      <div className="flex items-center">
        <LocationOn className="mr-2" />
        <Text variant="body2">{clubInfoQuery.data.location}</Text>
      </div>
      <div className="flex items-start">
        <Description className="mr-2" />
        <Text variant="body2">{clubInfoQuery.data.description}</Text>
      </div>
    </Paper>
  )
}
