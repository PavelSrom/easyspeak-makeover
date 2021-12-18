import { CardContent, CardHeader, Divider, Skeleton } from '@mui/material'

export const LoadingPostItem = () => (
  <div>
    <CardHeader
      className="p-0"
      avatar={<Skeleton variant="circular" className="w-16 h-16" />}
      title={<Skeleton variant="text" height={28} width="80%" />}
      subheader={
        <div>
          <Skeleton variant="text" height={16} width="80%" />
        </div>
      }
    />
    <Divider className="my-4" />
    <CardContent className="p-0">
      <Skeleton variant="text" height={28} width="80%" />
      <Skeleton variant="text" height={20} width="80%" />
    </CardContent>
  </div>
)
