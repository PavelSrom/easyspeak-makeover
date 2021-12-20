import { Avatar, Divider, IconButton } from '@mui/material'
import Delete from '@mui/icons-material/Delete'
import formatDistance from 'date-fns/formatDistance'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { Button, Text, TextField } from 'ui'
import { useAuth } from 'contexts/auth'
import { Form, Formik } from 'formik'
import { createNewCommentSchema } from 'utils/payload-validations'
import { useSnackbar } from 'notistack'
import error from 'public/feedback-illustrations/error.svg'
import connection from 'public/feedback-illustrations/connection.svg'
import { LoadingCommentItem } from 'ui/feedback/loading-comment-item'
import { IllustrationFeedback } from 'ui/feedback/illustration-feedback'

type Props = {
  postId: string
}

export const PostComments = ({ postId }: Props) => {
  const { profile } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useTypeSafeQueryClient()

  const commentsQuery = useTypeSafeQuery(['getAllComments', postId], null, {
    postId,
  })

  const { mutateAsync: createNewComment, isLoading: isCreatingComment } =
    useTypeSafeMutation('createNewComment', {
      onSuccess: () => {
        enqueueSnackbar('Comment added', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot add comment', {
          variant: 'error',
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries(['getAllComments', postId])
      },
    })

  const { mutateAsync: deleteComment } = useTypeSafeMutation(
    'deleteCommentById',
    {
      onSuccess: () => {
        enqueueSnackbar('Comment deleted', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot delete comment', {
          variant: 'error',
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries(['getAllComments', postId])
      },
    }
  )

  return (
    <div>
      {commentsQuery.isLoading && <LoadingCommentItem />}
      {commentsQuery.isError && (
        <IllustrationFeedback
          title="We couldn't find the comments!"
          message="Something went wrong, we couldn't find the comments for this post."
          illustration={error}
        />
      )}
      {commentsQuery.isSuccess && commentsQuery.data && (
        <>
          {commentsQuery.data.length > 0 ? (
            commentsQuery.data.map(comment => (
              <div key={comment.id} className="flex">
                <Avatar
                  src={comment.Author.avatar ?? ''}
                  className="w-12 h-12 mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text className="font-semibold">{`${comment.Author.name} ${comment.Author.surname}`}</Text>
                      <Text variant="small">
                        {formatDistance(
                          new Date(comment.createdAt),
                          new Date()
                        )}{' '}
                        ago
                      </Text>
                    </div>
                    {(profile?.roleTypeId ||
                      comment.authorId === profile?.id) && (
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => deleteComment([comment.id])}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </div>

                  <Text variant="body" className="mt-2">
                    {comment.message}
                  </Text>
                  <Divider className="my-4" />
                </div>
              </div>
            ))
          ) : (
            <IllustrationFeedback
              message="Be the first to comment!"
              illustration={connection}
              illustrationStyles="w-1/2 sm:w-1/3"
            />
          )}
        </>
      )}

      <Divider className="my-4" />

      <Formik
        initialValues={{ postId, message: '' }}
        validationSchema={createNewCommentSchema}
        onSubmit={async (values, { resetForm }) => {
          await createNewComment([values])
          resetForm()
        }}
      >
        <Form>
          <div className="flex items-stretch pb-2">
            <TextField name="message" label="Comment" />
            <Button loading={isCreatingComment} type="submit" color="secondary">
              Send
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
