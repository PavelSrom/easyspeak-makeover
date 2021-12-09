import Delete from '@mui/icons-material/Delete'
import Notifications from '@mui/icons-material/Notifications'
import { Badge, Divider, IconButton, Popover } from '@mui/material'
import clsx from 'clsx'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {
  useTypeSafeMutation,
  useTypeSafeOptimisticUpdate,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { useSnackbar } from 'notistack'
import { Fragment, useMemo, useState } from 'react'
import { Text } from 'ui'

export const NotificationPopper = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useTypeSafeQueryClient()
  const { optimisticUpdate, rollback } = useTypeSafeOptimisticUpdate()

  const { data: notifications = [] } = useTypeSafeQuery('getAllNotifications')

  const { mutateAsync: markNotifsAsRead } = useTypeSafeMutation(
    'markNotificationsAsRead',
    {
      onSettled: () => {
        queryClient.invalidateQueries('getAllNotifications')
      },
    }
  )

  const { mutateAsync: deleteNotifById } = useTypeSafeMutation(
    'deleteNotificationById',
    {
      // remove notification through optimistic update
      onMutate: async ([id]) => {
        const prevData = await optimisticUpdate(
          'getAllNotifications',
          old => old?.filter(notif => notif.id !== id) ?? []
        )

        return { prevData }
      },
      onError: (err, [_variables], context) => {
        enqueueSnackbar(
          err.response.data.message ?? 'Cannot delete notification',
          { variant: 'error' }
        )
        if (context.prevData) rollback('getAllNotifications', context.oldData)
      },
    }
  )

  const numOfUnread = useMemo(
    () => (notifications ?? []).filter(notif => !notif.read).length,
    [notifications]
  )

  const handlePopoverClose = () => {
    setAnchorEl(null)
    markNotifsAsRead([])
  }

  return (
    <>
      <Badge
        color="secondary"
        showZero={false}
        badgeContent={numOfUnread ?? 0}
        classes={{ badge: 'text-white' }}
      >
        <IconButton
          size="small"
          edge="end"
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          <Notifications className="text-white" />
        </IconButton>
      </Badge>

      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <div className="w-80 p-4">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <Fragment key={notif.id}>
                <div
                  className={clsx('pl-2', {
                    'border-l-4 border-tertiary': !notif.read,
                  })}
                >
                  <div className="flex justify-between items-center">
                    <Text
                      className={clsx('font-semibold truncate', {
                        'text-tertiary': !notif.read,
                      })}
                    >
                      {notif.title}
                    </Text>
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={() => deleteNotifById([notif.id])}
                    >
                      <Delete className="text-xl" />
                    </IconButton>
                  </div>
                  <Text variant="body2">{notif.message}</Text>
                  <Text variant="caption" className="mt-2">
                    {formatDistanceToNow(new Date(notif.createdAt))} ago
                  </Text>
                </div>

                <Divider className="my-2" />
              </Fragment>
            ))
          ) : (
            <Text variant="body2" className="text-center">
              (You have no notifications)
            </Text>
          )}
        </div>
      </Popover>
    </>
  )
}
