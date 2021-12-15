import { Paper } from '@mui/material'
import LocationOn from '@mui/icons-material/LocationOn'
import Description from '@mui/icons-material/Description'
import { Text } from 'ui'
import { useTypeSafeQuery } from 'hooks'
import { useOnboarding } from 'contexts/onboarding'

export const ClubInfo = () => {
  const clubInfoQuery = useTypeSafeQuery('getClubInfo')
  useOnboarding({ shown: !!clubInfoQuery.data && clubInfoQuery.isSuccess })

  if (clubInfoQuery.isLoading) return <p>Loading...</p>
  if (clubInfoQuery.isError || !clubInfoQuery.data) return <p>Error!</p>

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
