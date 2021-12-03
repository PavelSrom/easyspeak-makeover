import { useAuth } from 'contexts/auth'
import { NextPage } from 'next'
import { Button } from 'ui'
import { withAuth } from 'utils/with-auth'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Dashboard: NextPage = () => {
  const { logout } = useAuth()

  return (
    <div>
      <p>Protected dashboard page</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}

export default Dashboard
