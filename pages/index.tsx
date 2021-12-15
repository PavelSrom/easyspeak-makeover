import { CustomNextPage } from 'types/helpers'
import { withAuth } from 'utils/with-auth'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Dashboard: CustomNextPage = () => (
  <>
    <p className="onboarding-1">Protected dashboard page</p>
  </>
)

Dashboard.pageTitle = 'Dashboard'

export default Dashboard
