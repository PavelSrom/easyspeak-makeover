import Description from '@mui/icons-material/Description'
import LocationOn from '@mui/icons-material/LocationOn'
import AccessTime from '@mui/icons-material/AccessTime'
import ThumbUp from '@mui/icons-material/ThumbUp'
import ThumbDown from '@mui/icons-material/ThumbDown'
import { Avatar, Paper } from '@mui/material'
import formatDistance from 'date-fns/formatDistance'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { Button, Text } from 'ui'
import { useAuth } from 'contexts/auth'
import { useSnackbar } from 'notistack'
import { useOnboarding } from 'contexts/onboarding'

type Props = {
  meetingId: string
}

export const MeetingDetails = ({ meetingId }: Props) => {
  const { profile } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useTypeSafeQueryClient()

  const meetingDetailsQuery = useTypeSafeQuery(
    ['getMeetingById', meetingId],
    { enabled: !!meetingId },
    meetingId
  )
  useOnboarding({ shown: !!meetingDetailsQuery.data })

  const { mutateAsync: toggleAttendance, isLoading: isTogglingAttendance } =
    useTypeSafeMutation('toggleMeetingAttendance', {
      onSuccess: data => {
        enqueueSnackbar(data.message ?? 'Success', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(
          err.response.data.message ?? 'Cannot toggle attendance',
          { variant: 'error' }
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries(['getMeetingById', meetingId])
      },
    })

  const toggleAttend = (coming: boolean) => {
    toggleAttendance([{ meetingId, attending: coming === true }])
  }

  const iAmComing = meetingDetailsQuery.data?.Attendance.some(
    member => member.Member?.id === profile?.id
  )

  if (meetingDetailsQuery.isLoading) return <p>Loading...</p>
  if (meetingDetailsQuery.isError || !meetingDetailsQuery.data)
    return <p>Error!</p>

  return (
    <>
      <Paper className="p-4 mb-8 space-y-2 onboarding-8">
        <Text variant="h1_light">{meetingDetailsQuery.data.title}</Text>
        <div className="flex items-center">
          <LocationOn className="mr-2" />
          <Text variant="body2">{meetingDetailsQuery.data.venue}</Text>
        </div>
        <div className="flex items-center">
          <AccessTime className="mr-2" />
          <Text variant="body2">
            {formatDistance(
              new Date(meetingDetailsQuery.data.timeStart),
              new Date(meetingDetailsQuery.data.timeEnd)
            )}
          </Text>
        </div>
        <div className="flex items-start">
          <Description className="mr-2" />
          <Text variant="body2">{meetingDetailsQuery.data.description}</Text>
        </div>

        <div className="flex pt-4">
          <Avatar
            src={meetingDetailsQuery.data.Manager.avatar ?? ''}
            className="w-10 h-10 mr-4"
          />
          <div>
            <Text className="font-semibold">{`${meetingDetailsQuery.data.Manager.name} ${meetingDetailsQuery.data.Manager.surname}`}</Text>
            <Text variant="caption">Meeting manager</Text>
          </div>
        </div>
      </Paper>

      <Paper className="p-4 space-y-4">
        <Text variant="h1_light">Attendance</Text>
        <div className="bg-primary rounded-xl p-4 text-white">
          <Text variant="h3" className="text-center mb-4">
            Are you coming?
          </Text>
          <div className="flex justify-between">
            <Button
              size="small"
              color="secondary"
              startIcon={<ThumbUp />}
              disabled={iAmComing || isTogglingAttendance}
              loading={isTogglingAttendance}
              onClick={() => toggleAttend(true)}
            >
              Attend
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={<ThumbDown />}
              disabled={!iAmComing || isTogglingAttendance}
              loading={isTogglingAttendance}
              onClick={() => toggleAttend(false)}
            >
              Don&apos;t attend
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {meetingDetailsQuery.data.Attendance.length > 0 ? (
            meetingDetailsQuery.data.Attendance.map(member => (
              <div key={member.Member?.id} className="flex items-center">
                <Avatar
                  src={member.Member?.avatar ?? ''}
                  className="w-10 h-10 mr-4"
                />
                <Text className="font-semibold">{`${member.Member?.name} ${member.Member?.surname}`}</Text>
              </div>
            ))
          ) : (
            <Text className="text-center">(There are no people attending)</Text>
          )}
        </div>
      </Paper>
    </>
  )
}
