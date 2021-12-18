import { Paper } from '@mui/material'
import { useTypeSafeQuery } from 'hooks'
import { Text } from 'ui'
import { BoardMemberItem } from './club-boardmember-item'

export const ClubBoard = () => {
  const clubBoardQuery = useTypeSafeQuery('getClubBoard')

  return (
    <Paper className="p-4">
      <Text variant="h1_light" className="mb-6">
        Contact
      </Text>

      {clubBoardQuery.isLoading && <p>Loading...</p>}
      {clubBoardQuery.isError && <p>Error!</p>}
      {clubBoardQuery.isSuccess &&
        clubBoardQuery.data &&
        clubBoardQuery.data.map(person => (
          <BoardMemberItem boardMember={person} />
        ))}
    </Paper>
  )
}
