import AccessTime from '@mui/icons-material/AccessTime'
import LocationOn from '@mui/icons-material/LocationOn'
import format from 'date-fns/format'
import { MeetingSimpleDTO } from 'types/api'
import { Text } from 'ui'

type Props = {
  meeting: MeetingSimpleDTO
  onNavigate: () => void
}

export const MeetingCard = ({ meeting, onNavigate }: Props) => (
  // eslint-disable-next-line
  <div
    className="flex mb-4 cursor-pointer hover:opacity-75"
    onClick={onNavigate}
  >
    <div className="bg-tertiary rounded-xl w-16 h-16 text-white flex flex-col justify-center items-center">
      <Text variant="h1">{format(new Date(meeting.timeStart), 'dd')}</Text>
      <Text variant="h2">{format(new Date(meeting.timeStart), 'LLL')}</Text>
    </div>

    <div className="ml-4">
      <Text variant="h4">{meeting.Club.name}</Text>
      <div className="flex items-center">
        <LocationOn className="mr-2" />
        <Text variant="body2">{meeting.venue}</Text>
      </div>
      <div className="flex items-center">
        <AccessTime className="mr-2" />
        <Text variant="body2">{format(new Date(meeting.timeStart), 'p')}</Text>
      </div>
    </div>
  </div>
)
