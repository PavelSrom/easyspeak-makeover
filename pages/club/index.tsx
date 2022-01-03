import { Container } from '@mui/material'
import { ClubBoard } from 'components/club/club-board'
import { ClubInfo } from 'components/club/club-info'
import { ClubMembers } from 'components/club/club-members'
import { useLayout } from 'contexts/page-layout'
import { CustomNextPage } from 'types/helpers'
import { withAuth } from 'utils/with-auth'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Club: CustomNextPage = () => {
  const { activeTab } = useLayout()

  return (
    <Container className="py-4">
      {activeTab === 0 && <ClubInfo />}
      {activeTab === 1 && <ClubMembers />}
      {activeTab === 2 && <ClubBoard />}
    </Container>
  )
}

Club.pageTitle = 'Club'
Club.tabs = ['Info', 'Members', 'Contact']

export default Club
