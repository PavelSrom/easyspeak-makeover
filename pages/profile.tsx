import { Container } from '@mui/material'
import { ProfileAvatarPicker } from 'components/profile-avatar-picker'
import { CustomNextPage } from 'types/helpers'

const Profile: CustomNextPage = () => (
  <Container className="py-4">
    <ProfileAvatarPicker />

    <p>Profile page</p>
  </Container>
)

Profile.pageTitle = 'Profile'

export default Profile
