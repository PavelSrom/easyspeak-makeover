import { useAuth } from 'contexts/auth'
import { CustomNextPage } from 'types/helpers'
import { Button } from 'ui'
import { withAuth } from 'utils/with-auth'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Dashboard: CustomNextPage = () => {
  const { logout } = useAuth()

  return (
    <div>
      <p>Protected dashboard page</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}

Dashboard.pageTitle = 'Dashboard'

export default Dashboard
