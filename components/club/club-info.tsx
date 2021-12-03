import { Paper } from '@mui/material'
import { ClubInfoDTO } from 'types/api'
import { Text } from 'ui'

type Props = {
  info: ClubInfoDTO
}

export const ClubInfo = ({ info }: Props) => (
  <Paper className="p-4">
    <Text variant="h1_light">{info.name}</Text>
  </Paper>
)
