import { Container } from '@mui/material'
import { ProfileActivity } from 'components/profile-tabs/activity'
import { ProfileInfo } from 'components/profile-tabs/info'
import { ProfileSettings } from 'components/profile-tabs/settings'
import { useLayout } from 'contexts/page-layout'
import { CustomNextPage } from 'types/helpers'
import { withAuth } from 'utils/with-auth'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Profile: CustomNextPage = () => {
  const { activeTab } = useLayout()

  return (
    <Container className="py-4">
      {activeTab === 0 && <ProfileInfo />}
      {activeTab === 1 && <ProfileSettings />}
      {activeTab === 2 && <ProfileActivity />}
    </Container>
  )
}

Profile.pageTitle = 'Profile'
Profile.tabs = ['Info', 'Settings', 'Activity']

export default Profile
