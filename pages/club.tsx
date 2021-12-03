import { Container } from '@mui/material'
import { ClubInfo } from 'components/club/club-info'
import { ClubMembers } from 'components/club/club-members'
import { NewMemberDialog } from 'components/club/new-member-dialog'
import { useLayout } from 'contexts/page-layout'
import { useTypeSafeMutation, useTypeSafeQuery } from 'hooks'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { CustomNextPage } from 'types/helpers'

const Club: CustomNextPage = () => {
  const [newMemberDialogOpen, setNewMemberDialogOpen] = useState<boolean>(false)
  const { activeTab } = useLayout()
  const { enqueueSnackbar } = useSnackbar()

  const clubInfoQuery = useTypeSafeQuery('getClubInfo')
  const clubMembersQuery = useTypeSafeQuery('getClubMembers')
  const { mutate: createNewMember, isLoading: isCreatingNewMember } =
    useTypeSafeMutation('createNewMember', {
      onSuccess: () => {
        enqueueSnackbar('New member has been invited', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message, { variant: 'error' })
      },
      onSettled: () => {
        setNewMemberDialogOpen(false)
      },
    })

  const standardMembers = useMemo(
    () => clubMembersQuery.data?.filter(member => !member.ClubRole) ?? [],
    [clubMembersQuery.data]
  )
  // const boardMembers = useMemo(
  //   () => clubMembersQuery.data?.filter(member => !!member.ClubRole) ?? [],
  //   [clubMembersQuery.data]
  // )

  if (clubInfoQuery.isLoading || clubMembersQuery.isLoading)
    return <p>Loading...</p>
  if (
    clubInfoQuery.isError ||
    !clubInfoQuery.data ||
    clubMembersQuery.isError ||
    !clubMembersQuery.data
  )
    return <p>Error :(</p>

  return (
    <Container className="py-4">
      {activeTab === 0 && <ClubInfo info={clubInfoQuery.data} />}
      {activeTab === 1 && (
        <ClubMembers
          members={standardMembers}
          onAddMember={() => setNewMemberDialogOpen(true)}
        />
      )}

      <NewMemberDialog
        open={newMemberDialogOpen}
        onClose={() => setNewMemberDialogOpen(false)}
        isSubmitting={isCreatingNewMember}
        onInvite={values => createNewMember([values.email])}
      />
    </Container>
  )
}

Club.pageTitle = 'Club'
Club.tabs = ['Info', 'Members', 'Contact']

export default Club
