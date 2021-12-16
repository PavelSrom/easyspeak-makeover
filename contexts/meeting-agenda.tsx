import { requests } from 'backend'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { useRouter } from 'next/router'
import { createContext, useContext, useMemo } from 'react'
import { AgendaFullDTO, MemberSchemaDTO } from 'types/api'
import { useAuth } from './auth'
import { useOnboarding } from './onboarding'

type ContextProps = {
  meetingId: string
  meetingIsReadOnly: boolean
  isBoardMember: boolean
  agenda: AgendaFullDTO
  members: MemberSchemaDTO['clubMembers']
  memberAssignRole: typeof requests['mutation']['memberAssignRole']
  memberUnassignRole: typeof requests['mutation']['memberUnassignRole']
  adminAssignRole: typeof requests['mutation']['adminAssignRole']
  acceptAssignedRole: typeof requests['mutation']['acceptAssignedRole']
  approveSpeech: typeof requests['mutation']['toggleSpeechApproval']
}

const MeetingAgendaContext = createContext<ContextProps>({} as ContextProps)

export const MeetingAgendaProvider = ({
  meetingStart,
  children,
}: {
  meetingStart: Date
  children: React.ReactNode
}) => {
  const router = useRouter()
  const { profile } = useAuth()
  const queryClient = useTypeSafeQueryClient()

  const membersQuery = useTypeSafeQuery('getClubMembers')
  const agendaQuery = useTypeSafeQuery(
    ['getFullAgenda', router.query.id as string],
    { enabled: !!router.query.id },
    router.query.id as string
  )
  useOnboarding({ shown: !!membersQuery.data && !!agendaQuery.data })

  const { mutateAsync: memberAssignRoleMutation } = useTypeSafeMutation(
    'memberAssignRole',
    {
      onSettled: () => {
        queryClient.invalidateQueries('getFullAgenda')
      },
    }
  )

  const { mutateAsync: memberUnassignRoleMutation } = useTypeSafeMutation(
    'memberUnassignRole',
    {
      onSettled: () => {
        queryClient.invalidateQueries('getFullAgenda')
      },
    }
  )

  const { mutateAsync: adminAssignRoleMutation } = useTypeSafeMutation(
    'adminAssignRole',
    {
      onSettled: () => {
        queryClient.invalidateQueries('getFullAgenda')
      },
    }
  )

  const { mutateAsync: acceptAssignedRoleMutation } = useTypeSafeMutation(
    'acceptAssignedRole',
    {
      onSettled: () => {
        queryClient.invalidateQueries('getFullAgenda')
      },
    }
  )

  const { mutateAsync: toggleSpeechApproval } = useTypeSafeMutation(
    'toggleSpeechApproval',
    {
      onSettled: () => {
        queryClient.invalidateQueries('getFullAgenda')
      },
    }
  )

  const value: ContextProps = useMemo(
    () => ({
      meetingId: router.query.id as string,
      meetingIsReadOnly: new Date(meetingStart) < new Date(),
      isBoardMember: !!profile?.roleTypeId ?? false,
      agenda: agendaQuery.data!,
      members: membersQuery.data?.clubMembers ?? [],
      memberAssignRole: values => memberAssignRoleMutation([values]),
      memberUnassignRole: values => memberUnassignRoleMutation([values]),
      adminAssignRole: values => adminAssignRoleMutation([values]),
      acceptAssignedRole: values => acceptAssignedRoleMutation([values]),
      approveSpeech: values => toggleSpeechApproval([values]),
    }),
    [
      router.query.id,
      meetingStart,
      profile?.roleTypeId,
      agendaQuery.data,
      membersQuery.data,
      memberAssignRoleMutation,
      memberUnassignRoleMutation,
      adminAssignRoleMutation,
      acceptAssignedRoleMutation,
      toggleSpeechApproval,
    ]
  )

  if (agendaQuery.isLoading || membersQuery.isLoading) return <p>Loading...</p>
  if (agendaQuery.isError || !agendaQuery.data || !membersQuery.data)
    return <p>Error!</p>

  return (
    <MeetingAgendaContext.Provider value={value}>
      {children}
    </MeetingAgendaContext.Provider>
  )
}

export const useMeetingAgenda = (): ContextProps => {
  const context = useContext(MeetingAgendaContext)
  if (!context)
    throw new Error(
      'useMeetingAgenda must be used within MeetingAgendaProvider'
    )

  return context
}
