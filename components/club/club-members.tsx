import { Avatar, Divider, Fab, IconButton, Paper } from '@mui/material'
import AddOutlined from '@mui/icons-material/AddOutlined'
import Delete from '@mui/icons-material/Delete'
import { Text } from 'ui'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { useSnackbar } from 'notistack'
import { Fragment, useState } from 'react'
import formatDistance from 'date-fns/formatDistance'
import { useRouter } from 'next/router'
import { useAuth } from 'contexts/auth'
import { NewMemberDialog } from './new-member-dialog'

export const ClubMembers = () => {
  const [newMemberDialogOpen, setNewMemberDialogOpen] = useState<boolean>(false)
  const queryClient = useTypeSafeQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { profile } = useAuth()
  const router = useRouter()

  const clubMembersQuery = useTypeSafeQuery('getClubMembers')

  const { mutate: createNewMember, isLoading: isCreatingNewMember } =
    useTypeSafeMutation('createNewMember', {
      onSuccess: () => {
        enqueueSnackbar('New member has been invited', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot invite member', {
          variant: 'error',
        })
      },
      onSettled: () => {
        setNewMemberDialogOpen(false)
        queryClient.invalidateQueries('getClubMembers')
      },
    })

  const { mutate: deleteMemberInvite, isLoading: isDeletingInvite } =
    useTypeSafeMutation('deleteNewMemberById', {
      onSuccess: () => {
        enqueueSnackbar('Member invite deleted', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot delete invite', {
          variant: 'error',
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries('getClubMembers')
      },
    })

  const handleMemberNavigate = (id: string) => {
    // TODO: clean return under this condition
    if (id === profile?.id) console.log('hi')

    router.push(`/club/members/${id}`)
  }

  return (
    <div className="space-y-8">
      <Paper className="p-4">
        <Text variant="h1_light" className="mb-6">
          Members
        </Text>
        {clubMembersQuery.isLoading && <p>Loading...</p>}
        {clubMembersQuery.isError && <p>Error!</p>}
        {clubMembersQuery.isSuccess &&
          clubMembersQuery.data &&
          clubMembersQuery.data.clubMembers.map(member => (
            <Fragment key={member.id}>
              {/* eslint-disable-next-line */}
              <div
                key={member.id}
                role="listitem"
                className="flex cursor-pointer"
                onClick={() => handleMemberNavigate(member.id)}
              >
                <Avatar src={member.avatar ?? ''} className="w-10 h-10 mr-4" />
                <div>
                  <Text className="font-semibold">{`${member.name} ${member.surname}`}</Text>
                  <Text variant="body2">
                    {member.ClubRole?.name ?? 'Member'}
                  </Text>
                </div>
              </div>

              <Divider className="my-4" />
            </Fragment>
          ))}
      </Paper>
      <Paper className="p-4">
        <Text variant="h1_light" className="mb-6">
          Pending invites
        </Text>
        {clubMembersQuery.isLoading && <p>Loading...</p>}
        {clubMembersQuery.isError && <p>Error!</p>}
        {clubMembersQuery.isSuccess &&
          clubMembersQuery.data &&
          clubMembersQuery.data.pendingInvites.map(invite => (
            <Fragment key={invite.id}>
              <div className="flex">
                <Divider className="my-4" />

                <Avatar src="" className="w-10 h-10 mr-4" />
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <Text className="font-semibold">{invite.email}</Text>
                    <Text variant="body2">
                      {formatDistance(new Date(invite.createdAt), new Date())}{' '}
                      ago
                    </Text>
                  </div>
                  <IconButton
                    disabled={isDeletingInvite}
                    onClick={() => deleteMemberInvite([invite.id])}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>

              <Divider className="my-4" />
            </Fragment>
          ))}
      </Paper>

      <Fab
        variant="extended"
        color="secondary"
        size="small"
        className="fixed bottom-4 right-4 text-white"
        onClick={() => setNewMemberDialogOpen(true)}
      >
        <AddOutlined />
        Add member
      </Fab>

      <NewMemberDialog
        open={newMemberDialogOpen}
        onClose={() => setNewMemberDialogOpen(false)}
        isSubmitting={isCreatingNewMember}
        onInvite={values => createNewMember([values.email])}
      />
    </div>
  )
}
