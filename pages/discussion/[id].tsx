import {
  Avatar,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material'
import MoreVert from '@mui/icons-material/MoreVert'
import formatDistance from 'date-fns/formatDistance'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { Text } from 'ui'
import { useAuth } from 'contexts/auth'
import { useSnackbar } from 'notistack'
import { PostComments } from 'components/post-comments'

const PostDetail: CustomNextPage = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const queryClient = useTypeSafeQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { profile } = useAuth()
  const router = useRouter()

  const postDetailQuery = useTypeSafeQuery(
    ['getPostById', router.query.id as string],
    { enabled: !!router.query.id },
    router.query.id as string
  )
  console.log(postDetailQuery.data)

  const { mutateAsync: deletePost, isLoading: isDeletingPost } =
    useTypeSafeMutation('deletePostById', {
      onSuccess: () => {
        router.replace('/discussion')
        enqueueSnackbar('Post deleted', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot delete post', {
          variant: 'error',
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries('getAllPosts')
      },
    })

  if (postDetailQuery.isLoading) return <p>Loading...</p>
  if (postDetailQuery.isError || !postDetailQuery.data) return <p>Error!</p>

  const post = postDetailQuery.data

  return (
    <Container className="py-4">
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {profile?.roleTypeId && <MenuItem>Pin post (TODO)</MenuItem>}
        <MenuItem
          disabled={isDeletingPost}
          onClick={() => deletePost([post.id])}
        >
          Delete post
        </MenuItem>
      </Menu>

      <Paper className="p-4 rounded-xl">
        <div className="flex items-center">
          <Avatar src={post.Author.avatar ?? ''} className="w-12 h-12" />
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-center">
              <Text variant="h2">{`${post.Author.name} ${post.Author.surname}`}</Text>
              {/* if it's a board member or author of the post */}
              {(post.authorId === profile?.id || profile?.roleTypeId) && (
                <IconButton
                  size="small"
                  edge="end"
                  onClick={e => setAnchorEl(e.currentTarget)}
                >
                  <MoreVert />
                </IconButton>
              )}
            </div>
            <Text variant="body2">
              {post.Author.ClubRole?.name ?? 'Member'}
            </Text>
            <Text variant="body2">
              {formatDistance(new Date(post.createdAt), new Date())} ago
            </Text>
          </div>
        </div>

        <Divider className="my-4" />

        <Text variant="h2">{post.title}</Text>
        <Text variant="body2">{post.body}</Text>

        <Divider className="my-4" />

        <PostComments postId={router.query.id as string} />
      </Paper>
    </Container>
  )
}

PostDetail.pageTitle = 'Discussion detail'

export default PostDetail
