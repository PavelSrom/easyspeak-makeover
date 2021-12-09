import { useTypeSafeQuery } from 'hooks'

type Props = {
  meetingId: string
}

export const MeetingAgenda = ({ meetingId }: Props) => {
  const agendaQuery = useTypeSafeQuery(
    ['getFullAgenda', meetingId],
    { enabled: !!meetingId },
    meetingId
  )
  console.log(agendaQuery.data)

  return <p>Meeting agenda </p>
}
