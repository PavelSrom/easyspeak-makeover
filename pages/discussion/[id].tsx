import { useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { CustomNextPage } from 'types/helpers'

const PostDetail: CustomNextPage = () => {
  const router = useRouter()

  const postDetailQuery = useTypeSafeQuery(
    ['getPostById', router.query.id as string],
    null,
    router.query.id as string
  )
  console.log(postDetailQuery.data)

  return <p>Post detail: {router.query.id}</p>
}

PostDetail.pageTitle = 'Discussion detail'

export default PostDetail
