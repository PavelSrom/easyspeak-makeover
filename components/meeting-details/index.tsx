import Description from '@mui/icons-material/Description'
import LocationOn from '@mui/icons-material/LocationOn'
import AccessTime from '@mui/icons-material/AccessTime'
import ThumbUp from '@mui/icons-material/ThumbUp'
import ThumbDown from '@mui/icons-material/ThumbDown'
import { Avatar, Paper } from '@mui/material'
import formatDistance from 'date-fns/formatDistance'
import { useTypeSafeMutation, useTypeSafeQueryClient } from 'hooks'
import { Button, Text } from 'ui'
import { useAuth } from 'contexts/auth'
import { useSnackbar } from 'notistack'
import { useOnboarding } from 'contexts/onboarding'
import { MeetingFullDTO } from 'types/api'
import { useEffect, useState } from 'react'
import { AttendanceStatusItem } from 'ui/attendanceStatusItem'

type Props = {
  meeting: MeetingFullDTO
}

export const MeetingDetails = ({ meeting }: Props) => {
  const { profile } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useTypeSafeQueryClient()
  useOnboarding({ shown: !!meeting })
  const [attendanceStatus, setattendanceStatus] = useState<
    'NOT COMING' | 'COMING' | undefined
  >(undefined)

  useEffect(() => {
    meeting.Attendance.forEach(member => {
      if (member.Member?.id === profile?.id) {
        if (member.RoleType?.name === 'Not coming') {
          setattendanceStatus('NOT COMING')
          return
        }
        setattendanceStatus('COMING')
      }
    })
  })

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
        queryClient.invalidateQueries(['getMeetingById', meeting.id])
      },
    })

  const changeAttendance = (coming: boolean) => {
    toggleAttendance([{ meetingId: meeting.id, attending: coming === true }])
  }

  const renderAttendanceBox = () => {
    if (attendanceStatus === 'COMING') {
      return (
        <div className="flex flex-col gap-2 items-center">
          <AttendanceStatusItem status="success">
            <ThumbUp />
            <Text variant="h4" className="uppercase">
              You are attending
            </Text>
          </AttendanceStatusItem>
          <Button
            size="small"
            color="inherit"
            startIcon={<ThumbDown />}
            loading={isTogglingAttendance}
            disabled={isTogglingAttendance}
            onClick={() => changeAttendance(false)}
            variant="text"
          >
            Dont&apos;t attend
          </Button>
        </div>
      )
    }
    if (attendanceStatus === 'NOT COMING') {
      return (
        <div className="flex flex-col gap-2 items-center">
          <AttendanceStatusItem status="error">
            <ThumbUp />
            <Text variant="h4" className="uppercase">
              You are not attending
            </Text>
          </AttendanceStatusItem>
          <Button
            size="small"
            color="inherit"
            startIcon={<ThumbUp />}
            disabled={isTogglingAttendance}
            loading={isTogglingAttendance}
            onClick={() => changeAttendance(true)}
            variant="text"
          >
            {attendanceStatus !== 'NOT COMING' ? 'You are attending' : 'Attend'}
          </Button>
        </div>
      )
    }
    return (
      <div className="flex justify-center gap-2 sm:gap-6">
        <Button
          size="small"
          color="success"
          startIcon={<ThumbUp />}
          disabled={isTogglingAttendance}
          loading={isTogglingAttendance}
          onClick={() => changeAttendance(true)}
          variant={attendanceStatus === 'NOT COMING' ? 'text' : 'contained'}
        >
          Attend
        </Button>
        <Button
          size="small"
          color="inherit"
          startIcon={<ThumbDown />}
          disabled={isTogglingAttendance}
          loading={isTogglingAttendance}
          onClick={() => changeAttendance(false)}
          variant="outlined"
        >
          Dont&apos;t attend
        </Button>
      </div>
    )
  }

  return (
    <>
      <Paper className="p-4 mb-8 space-y-2 onboarding-8">
        <Text variant="h1_light">{meeting.title}</Text>
        <div className="flex items-center">
          <LocationOn className="mr-2" />
          <Text variant="body2">{meeting.venue}</Text>
        </div>
        <div className="flex items-center">
          <AccessTime className="mr-2" />
          <Text variant="body2">
            {formatDistance(
              new Date(meeting.timeStart),
              new Date(meeting.timeEnd)
            )}
          </Text>
        </div>
        <div className="flex items-start">
          <Description className="mr-2" />
          <Text variant="body2">{meeting.description}</Text>
        </div>

        <div className="flex pt-4">
          <Avatar
            src={meeting.Manager.avatar ?? ''}
            className="w-10 h-10 mr-4"
          />
          <div>
            <Text className="font-semibold">{`${meeting.Manager.name} ${meeting.Manager.surname}`}</Text>
            <Text variant="caption">Meeting manager</Text>
          </div>
        </div>
      </Paper>

      <Paper className="p-4 space-y-4">
        <Text variant="h1_light">Attendance</Text>
        <div
          className={`rounded-xl p-4 ${
            attendanceStatus
              ? 'border border-solid border-primary'
              : 'bg-primary text-white'
          }`}
        >
          <Text variant="h3" className="text-center mb-4">
            Are you coming?
          </Text>
          {renderAttendanceBox()}
        </div>

        <div className="space-y-4">
          {meeting.Attendance.length > 0 ? (
            meeting.Attendance.map(member => {
              if (member.RoleType.name !== 'Not coming') {
                return (
                  <div key={member.Member?.id} className="flex items-center">
                    <Avatar
                      src={member.Member?.avatar ?? ''}
                      className="w-10 h-10 mr-4"
                    />
                    <Text className="font-semibold">{`${member.Member?.name} ${member.Member?.surname}`}</Text>
                  </div>
                )
              }
              return <></>
            })
          ) : (
            <Text className="text-center">(There are no people attending)</Text>
          )}
        </div>
      </Paper>
    </>
  )
}
