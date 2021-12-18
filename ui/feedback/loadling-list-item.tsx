import { CardHeader, Skeleton } from '@mui/material'

export const LoadingListItem = () => (
  <CardHeader
    className="p-0"
    avatar={<Skeleton variant="rectangular" className="rounded-xl w-16 h-16" />}
    title={<Skeleton variant="text" height={24} width="80%" />}
    subheader={
      <div>
        <Skeleton variant="text" height={20} width="80%" />
        <Skeleton variant="text" height={20} width="80%" />
      </div>
    }
  />
)
