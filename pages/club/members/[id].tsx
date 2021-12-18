import { Avatar, Container, Fab, Paper } from '@mui/material'
import LocationOn from '@mui/icons-material/LocationOn'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Phone from '@mui/icons-material/Phone'
import Email from '@mui/icons-material/Email'
import Edit from '@mui/icons-material/Edit'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { useRouter } from 'next/router'
import { CustomNextPage } from 'types/helpers'
import { Text } from 'ui'
import { useAuth } from 'contexts/auth'
import { ChangeRoleDialog } from 'components/change-role-dialog'
import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { theme } from '../../../styles/theme'

const ClubMember: CustomNextPage = () => {
  const [roleDialogOpen, setRoleDialogOpen] = useState<boolean>(false)
  const queryClient = useTypeSafeQueryClient()
  const router = useRouter()
  const { profile } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const memberDetailQuery = useTypeSafeQuery(
    ['getClubMemberById', router.query.id as string],
    { enabled: !!router.query.id },
    router.query.id as string
  )
  const clubRolesQuery = useTypeSafeQuery('getClubRoles', {
    enabled: roleDialogOpen,
  })

  const { mutateAsync: changeMemberRole, isLoading: isChangingMemberRole } =
    useTypeSafeMutation('changeMemberRole', {
      onSuccess: () => {
        enqueueSnackbar('Role has been changed', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(
          err.response.data.message ?? 'Cannot change member role',
          { variant: 'error' }
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries([
          'getClubMemberById',
          router.query.id as string,
        ])
        setRoleDialogOpen(false)
      },
    })

  if (memberDetailQuery.isLoading) return <p>Loading...</p>
  if (memberDetailQuery.isError || !memberDetailQuery.data) return <p>Error!</p>

  const { avatar, name, surname, phone, ClubRole, User } =
    memberDetailQuery.data

  return (
    <Container className="py-4">
      <Paper className="p-4">
        <Avatar src={avatar ?? ''} className="w-36 h-36 mx-auto my-4" />
        <Text variant="h1_light" className="mb-2">{`${name} ${surname}`}</Text>
        <div className="space-y-3">
          <div className="flex items-center">
            <LocationOn
              className="mr-2"
              sx={{ color: theme.palette.neutral.main }}
            />
            <Text variant="body">{User.Club.name}</Text>
          </div>
          <div className="flex items-center">
            <AccountCircle
              className="mr-2"
              sx={{ color: theme.palette.neutral.main }}
            />
            <Text variant="body">{ClubRole?.name ?? 'Member'}</Text>
          </div>
          <div className="flex items-center">
            <Phone
              className="mr-2"
              sx={{ color: theme.palette.neutral.main }}
            />
            <Text variant="body">{phone}</Text>
          </div>
          <div className="flex items-center">
            <Email
              className="mr-2"
              sx={{ color: theme.palette.neutral.main }}
            />
            <Text variant="body">{User.email}</Text>
          </div>
        </div>

        {profile?.roleTypeId && (
          <div className="flex justify-end mt-4">
            <Fab color="secondary" onClick={() => setRoleDialogOpen(true)}>
              <Edit className="text-white" />
            </Fab>
          </div>
        )}
      </Paper>

      <ChangeRoleDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        name={name}
        isSubmitting={isChangingMemberRole}
        clubRoles={clubRolesQuery.data ?? []}
        onChangeRole={({ clubRole }) =>
          changeMemberRole([{ memberId: router.query.id as string, clubRole }])
        }
      />
    </Container>
  )
}

ClubMember.pageTitle = 'Club member'

export default ClubMember
