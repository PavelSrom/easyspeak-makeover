import { Badge, Container, Fab, Paper } from '@mui/material'
import AddOutlined from '@mui/icons-material/AddOutlined'
import { PickersDay } from '@mui/lab'
import startOfDay from 'date-fns/startOfDay'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import format from 'date-fns/format'
import { useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { StaticDatePicker, Text } from 'ui'
import { useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { useAuth } from 'contexts/auth'

const Meetings: CustomNextPage = () => {
  const [dayIsClicked, setDayIsClicked] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()).toISOString(),
    end: endOfMonth(new Date()).toISOString(),
  })
  const [value, setValue] = useState<Date>(new Date())
  const router = useRouter()
  const { profile } = useAuth()

  const meetingsInMonthQuery = useTypeSafeQuery(
    ['getAllMeetings', dateRange.start, dateRange.end],
    null,
    { timeStart: dateRange.start, timeEnd: dateRange.end }
  )

  return (
    <Container className="py-4">
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        openTo="month"
        views={['day']}
        value={value}
        onChange={newDate => {
          setValue(newDate as Date)
          setDayIsClicked(true)
        }}
        onMonthChange={newDate => {
          setDateRange({
            start: startOfMonth(new Date(newDate as Date)).toISOString(),
            end: endOfMonth(new Date(newDate as Date)).toISOString(),
          })
        }}
        // @ts-ignore
        renderDay={(day: Date, _value, DayComponentProps) => {
          const dayHasMeeting = meetingsInMonthQuery.data?.some(
            meeting =>
              startOfDay(new Date(meeting.timeStart)).getTime() ===
              startOfDay(new Date(day)).getTime()
          )

          return (
            <Badge
              classes={{ badge: 'top-7 left-3 w-2' }}
              color="secondary"
              variant="dot"
              invisible={!dayHasMeeting}
            >
              <PickersDay {...DayComponentProps} />
            </Badge>
          )
        }}
      />

      <Paper className="mt-4 p-4">
        <Text variant="h1_light" className="mb-4">
          Next meetings
        </Text>
        {(meetingsInMonthQuery.data ?? []).map(meeting => (
          // eslint-disable-next-line
          <div
            key={meeting.id}
            className="flex mb-4"
            onClick={() => router.push(`/meetings/${meeting.id}`)}
          >
            <div className="bg-tertiary rounded-xl w-16 h-16 text-white flex flex-col justify-center items-center">
              <Text variant="h1">
                {format(new Date(meeting.timeStart), 'dd')}
              </Text>
              <Text variant="h2">
                {format(new Date(meeting.timeStart), 'LLL')}
              </Text>
            </div>

            <div className="ml-4">
              <Text variant="h4">{meeting.Club.name}</Text>
              <div className="flex items-center">
                <Text variant="body2">{meeting.venue}</Text>
              </div>
              <div className="flex items-center">
                <Text variant="body2">
                  {format(new Date(meeting.timeStart), 'p')}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </Paper>

      {dayIsClicked && profile?.roleTypeId && (
        <Fab
          variant="extended"
          color="secondary"
          size="medium"
          className="fixed bottom-4 right-4 text-white"
          onClick={() =>
            router.push(`/meetings/add?day=${value.toLocaleDateString()}`)
          }
        >
          <AddOutlined />
          Create meeting
        </Fab>
      )}
    </Container>
  )
}

Meetings.pageTitle = 'Meetings'

export default Meetings
