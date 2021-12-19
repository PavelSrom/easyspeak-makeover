import { CircularProgress, Container, Paper } from '@mui/material'
import { useTypeSafeQuery } from 'hooks'
import { Text } from 'ui'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import error from 'public/feedback-illustrations/error.svg'
import { useAuth } from 'contexts/auth'
import { BoardMemberItem } from './club-boardmember-item'

export const ClubBoard = () => {
  const clubBoardQuery = useTypeSafeQuery('getClubBoard')
  const { profile } = useAuth()

  return (
    <Paper className="p-4">
      <Text variant="h1_light" className="mb-6">
        Contact
      </Text>

      {clubBoardQuery.isLoading && (
        <Container className="py-4 text-center">
          <CircularProgress color="primary" />
        </Container>
      )}
      {clubBoardQuery.isError && (
        <Paper className="p-4">
          <IllustrationFeedback
            title="Sorry!"
            message={`Something went wrong, we couldn't find the contact information for ${
              profile?.User.Club.name || 'your club'
            }.`}
            illustration={error}
          />
        </Paper>
      )}
      {clubBoardQuery.isSuccess &&
        clubBoardQuery.data &&
        clubBoardQuery.data.map(person => (
          <BoardMemberItem boardMember={person} />
        ))}
    </Paper>
  )
}
