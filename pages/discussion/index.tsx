import { AddOutlined } from '@mui/icons-material'
import { Container, Fab } from '@mui/material'
import { NewPostDialog } from 'components/new-post-dialog'
import { PostCard } from 'components/post-card'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { CustomNextPage } from 'types/helpers'

const Discussion: CustomNextPage = () => {
  const [newPostDialogOpen, setNewPostDialogOpen] = useState<boolean>(false)
  const queryClient = useTypeSafeQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

  const postsQuery = useTypeSafeQuery('getAllPosts')

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
    <Container className="py-4">
      {postsQuery.isLoading && /* spinner or skeletons */ <p>Loading...</p>}
      {postsQuery.isError && /* error UI */ <p>Error!</p>}
      {postsQuery.isSuccess && postsQuery.data && (
        <>
          {postsQuery.data.length > 0 ? (
            postsQuery.data.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onNavigate={() => router.push(`/discussion/${post.id}`)}
              />
            ))
          ) : (
            <p>No posts have been added yet</p>
          )}
        </>
      )}

      <Fab
        variant="extended"
        color="secondary"
        size="small"
        className="fixed bottom-4 right-4 text-white"
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
