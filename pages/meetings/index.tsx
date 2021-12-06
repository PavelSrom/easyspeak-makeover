import { Badge, Container, Paper } from '@mui/material'
import { PickersDay } from '@mui/lab'
import startOfDay from 'date-fns/startOfDay'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import { useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { StaticDatePicker, Text } from 'ui'
import { useTypeSafeQuery } from 'hooks'

const Meetings: CustomNextPage = () => {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()).toISOString(),
    end: endOfMonth(new Date()).toISOString(),
  })
  const [value, setValue] = useState<Date>(new Date())

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
          // console.log(newDate)
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
        <Text variant="h1_light">Next meetings</Text>
      </Paper>
    </Container>
  )
}

Meetings.pageTitle = 'Meetings'

export default Meetings
