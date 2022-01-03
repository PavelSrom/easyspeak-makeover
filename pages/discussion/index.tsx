import { AddOutlined } from '@mui/icons-material'
import { Container, Fab, Paper } from '@mui/material'
import { NewPostDialog } from 'components/new-post-dialog'
import { PostCard } from 'components/post-card'
import { useOnboarding } from 'contexts/onboarding'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { LoadingPostItem } from 'ui/feedback/loading-post-item'
import error from 'public/feedback-illustrations/error.svg'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'
import { useAuth } from 'contexts/auth'
import no_pinned_post from 'public/feedback-illustrations/no_pinned_post.svg'
import { withAuth } from 'utils/with-auth'

export const getServerSideProps = withAuth(async ({ session }) => ({
  props: { session },
}))

const Discussion: CustomNextPage = () => {
  const [newPostDialogOpen, setNewPostDialogOpen] = useState<boolean>(false)
  const queryClient = useTypeSafeQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const { profile } = useAuth()

  const postsQuery = useTypeSafeQuery(['getAllPosts', false], null, {
    isPinned: undefined,
  })
  useOnboarding({ shown: !!postsQuery.data && postsQuery.isSuccess })

  const { mutateAsync: createNewPost, isLoading: isCreatingNewPost } =
    useTypeSafeMutation('createNewPost', {
      onSuccess: () => {
        enqueueSnackbar('Post created', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot create post', {
          variant: 'error',
        })
      },
      onSettled: () => {
        setNewPostDialogOpen(false)
        queryClient.invalidateQueries('getAllPosts')
      },
    })

  return (
    <Container>
      {postsQuery.isLoading && (
        <div className="py-4 grid gap-4 grid-cols-1 md:grid-cols-2">
          <Paper className="p-4 rounded-xl cursor-pointer">
            <LoadingPostItem />
          </Paper>
          <Paper className="p-4 rounded-xl cursor-pointer">
            <LoadingPostItem />
          </Paper>
        </div>
      )}
      {postsQuery.isError && (
        <Paper className="mt-4">
          <IllustrationFeedback
            title="Sorry!"
            message={`Something went wrong, we couldn't find the pinned post from ${
              profile?.User.Club.name || 'your club'
            }`}
            illustration={error}
          />
        </Paper>
      )}
      {postsQuery.isSuccess && postsQuery.data && (
        <div className="py-4 grid gap-4 grid-cols-1 md:grid-cols-2">
          {postsQuery.data.length > 0 ? (
            postsQuery.data.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onNavigate={() => router.push(`/discussion/${post.id}`)}
              />
            ))
          ) : (
            <Paper>
              <IllustrationFeedback
                title="Be the first!"
                message={`No posts have been added in ${
                  profile?.User.Club.name || 'your club'
                }, click "create post" and make the first post`}
                illustration={no_pinned_post}
              />
            </Paper>
          )}
        </div>
      )}

      <Fab
        variant="extended"
        color="secondary"
        size="medium"
        className="fixed bottom-4 right-4 text-white onboarding-4"
        onClick={() => setNewPostDialogOpen(true)}
      >
        <AddOutlined />
        Create post
      </Fab>

      <NewPostDialog
        open={newPostDialogOpen}
        onClose={() => setNewPostDialogOpen(false)}
        isSubmitting={isCreatingNewPost}
        onCreate={values => createNewPost([values])}
      />
    </Container>
  )
}

Discussion.pageTitle = 'Discussion forum'

export default Discussion
