import { CardHeader, Skeleton } from '@mui/material'

export const LoadingClubInfo = () => (
  <div className="flex flex-col gap-1">
    <Skeleton variant="text" height={36} width="80%" className="mb-3" />
    <CardHeader
      className="p-0"
      avatar={<Skeleton variant="circular" className="w-6 h-6" />}
      title={<Skeleton variant="text" height={20} width="40%" />}
    />
    <CardHeader
      className="p-0"
      avatar={<Skeleton variant="circular" className="w-6 h-6" />}
      title={<Skeleton variant="text" height={60} width="80%" />}
    />
  </div>
)
