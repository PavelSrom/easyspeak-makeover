import { Badge, Container, Fab, Paper } from '@mui/material'
import AddOutlined from '@mui/icons-material/AddOutlined'
import { PickersDay } from '@mui/lab'
import {
  add,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  format,
  startOfToday,
} from 'date-fns'
import { useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { Button, StaticDatePicker, Text } from 'ui'
import { useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { useAuth } from 'contexts/auth'
import { MeetingCard } from 'components/meeting-card'
import clsx from 'clsx'
import { useOnboarding } from 'contexts/onboarding'

const Meetings: CustomNextPage = () => {
  const [rangeIsChanged, setRangeIsChanged] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()).toISOString(),
    end: endOfMonth(new Date()).toISOString(),
  })
  const [listRange, setListRange] = useState({
    start: startOfToday().toISOString(),
    end: add(startOfToday(), { months: 1 }).toISOString(),
  })
  const [value, setValue] = useState<Date>(new Date())
  const router = useRouter()
  const { profile } = useAuth()
  const [headline, setHeadline] = useState<string>('Next meetings')

  const meetingsInMonthQuery = useTypeSafeQuery(
    ['getAllMeetings', dateRange.start, dateRange.end],
    null,
    { timeStart: dateRange.start, timeEnd: dateRange.end }
  )
  useOnboarding({ shown: !!meetingsInMonthQuery.data })

  const meetingListQuery = useTypeSafeQuery(
    ['getAllMeetings', listRange.start, listRange.end],
    null,
    { timeStart: listRange.start, timeEnd: listRange.end }
  )

  return (
    <Container className="py-4">
      <div className="onboarding-6">
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          views={['day']}
          openTo="month"
          value={value}
          onChange={newDate => {
            setValue(newDate as Date)
            setListRange({
              start: startOfDay(new Date(newDate as Date)).toISOString(),
              end: endOfDay(new Date(newDate as Date)).toISOString(),
            })
            setHeadline(
              `Meetings for ${format(new Date(newDate as Date), 'd. MMMM')}`
            )
            setRangeIsChanged(true)
          }}
          onMonthChange={newDate => {
            const range = {
              start: startOfMonth(new Date(newDate as Date)).toISOString(),
              end: endOfMonth(new Date(newDate as Date)).toISOString(),
            }
            setDateRange(range)
            setListRange(range)
            setHeadline(
              `Meetings in ${format(new Date(newDate as Date), 'LLLL')}`
            )
            setRangeIsChanged(true)
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
                variant="dot"
                invisible={!dayHasMeeting}
                color="secondary"
              >
                <PickersDay {...DayComponentProps} />
              </Badge>
            )
          }}
        />
      </div>

      <Paper className="mt-4 p-4">
        <Text variant="h1_light" className="mb-4 onboarding-7">
          {headline}
        </Text>
        {meetingListQuery.data ? (
          (meetingListQuery.data ?? []).map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onNavigate={() => router.push(`/meetings/${meeting.id}`)}
            />
          ))
        ) : (
          // TODO: A better message for the user
          <Text>No meetings is found</Text>
        )}
        <div
          className={clsx('text-center width-full mt-2', {
            'opacity-0': !rangeIsChanged,
          })}
        >
          <Button
            variant="outlined"
            className="ml-auto"
            onClick={() => {
              setListRange({
                start: new Date().toISOString(),
                end: add(new Date(), { months: 1 }).toISOString(),
              })
              setHeadline('Next meetings')
              setValue(new Date())
              setRangeIsChanged(false)
            }}
          >
            Reset
          </Button>
        </div>
      </Paper>

      {profile?.roleTypeId && (
        <Fab
          variant="extended"
          color="secondary"
          size="medium"
          className="fixed bottom-4 right-4 text-white"
          onClick={() => router.push(`/meetings/add`)}
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
