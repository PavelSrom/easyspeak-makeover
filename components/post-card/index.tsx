import { Avatar, Divider, Paper } from '@mui/material'
import ChatBubble from '@mui/icons-material/ChatBubble'
import PushPin from '@mui/icons-material/PushPin'
import { PostSimpleDTO } from 'types/api'
import { Text } from 'ui'

type Props = {
  post: PostSimpleDTO
  onNavigate: () => void
}

export const PostCard = ({ post, onNavigate }: Props) => (
  <Paper className="p-4 rounded-xl">
    <div className="flex items-center">
      <Avatar src={post.Author.avatar ?? ''} className="w-12 h-12" />
      <div className="ml-4">
        <Text variant="h3">{`${post.Author.name} ${post.Author.surname}`}</Text>
        <Text variant="small">{post.Author.ClubRole?.name ?? 'Member'}</Text>
      </div>
    </div>

    <Divider className="my-4" />

    {/* eslint-disable-next-line */}
    <div onClick={() => onNavigate()}>
      <Text variant="h2">{post.title}</Text>
      <Text variant="body2">{post.body}</Text>
    </div>

    <div className="mt-4 flex justify-end">
      {post.isPinned && (
        <div className="flex mr-2">
          <PushPin className="text-secondary" />
        </div>
      )}
      <div className="flex">
        <ChatBubble className="text-primary" />
        <Text variant="small" className="text-primary ml-2">
          {post._count.Comments}
        </Text>
      </div>
    </div>
  </Paper>
)
