import { CardHeader, Divider, Skeleton } from '@mui/material'

export const LoadingCommentItem = () => (
  <div>
    <CardHeader
      className="p-0"
      avatar={<Skeleton variant="circular" className="w-16 h-16" />}
      title={
        <div>
          <Skeleton variant="text" height={24} width="50%" />
          <Skeleton variant="text" height={16} width="50%" />
        </div>
      }
      subheader={
        <div>
          <Skeleton variant="text" height={44} width="80%" />
        </div>
      }
    />
    <Divider className="my-4" />
  </div>
)
