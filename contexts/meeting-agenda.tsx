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

type ContextProps = {
  meetingId: string
  isBoardMember: boolean
  isAssigningRole: boolean
  agenda: AgendaFullDTO
  members: MemberSchemaDTO['clubMembers']
  memberAssignRole: typeof requests['mutation']['memberAssignRole']
  memberUnassignRole: typeof requests['mutation']['memberUnassignRole']
}

const MeetingAgendaContext = createContext<ContextProps>({} as ContextProps)

export const MeetingAgendaProvider = ({
  children,
}: {
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

  const {
    mutateAsync: memberAssignRoleMutation,
    isLoading: isAssigningMemberRole,
  } = useTypeSafeMutation('memberAssignRole', {
    onSettled: () => {
      queryClient.invalidateQueries('getFullAgenda')
    },
  })
  const {
    mutateAsync: memberUnassignRoleMutation,
    isLoading: isUnassigningMemberRole,
  } = useTypeSafeMutation('memberUnassignRole', {
    onSettled: () => {
      queryClient.invalidateQueries('getFullAgenda')
    },
  })

  const value: ContextProps = useMemo(
    () => ({
      meetingId: router.query.id as string,
      isBoardMember: !!profile?.roleTypeId ?? false,
      isAssigningRole: isAssigningMemberRole || isUnassigningMemberRole,
      agenda: agendaQuery.data!,
      members: membersQuery.data?.clubMembers ?? [],
      memberAssignRole: values => memberAssignRoleMutation([values]),
      memberUnassignRole: values => memberUnassignRoleMutation([values]),
    }),
    [
      router.query.id,
      profile?.roleTypeId,
      isAssigningMemberRole,
      isUnassigningMemberRole,
      agendaQuery.data,
      membersQuery.data,
      memberAssignRoleMutation,
      memberUnassignRoleMutation,
    ]
  )

  if (agendaQuery.isLoading) return <p>Loading...</p>
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
