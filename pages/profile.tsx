import { Container, MenuItem } from '@mui/material'
import { ProfileAvatarPicker } from 'components/profile-avatar-picker'
import { useAuth } from 'contexts/auth'
import { Form, Formik } from 'formik'
import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { useSnackbar } from 'notistack'
import { CustomNextPage } from 'types/helpers'
import { Button, Text, TextField } from 'ui'

const Profile: CustomNextPage = () => {
  const { profile } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useTypeSafeQueryClient()

  const pathwaysQuery = useTypeSafeQuery('getAllPathways')

  const { mutateAsync: updateProfile, isLoading: isUpdatingProfile } =
    useTypeSafeMutation('updateUserProfile', {
      onSuccess: () => {
        enqueueSnackbar('Profile updated', { variant: 'success' })
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot update profile', {
          variant: 'error',
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries('getUserProfile')
      },
    })

  return (
    <Container className="py-4">
      <ProfileAvatarPicker />

      <Formik
        enableReinitialize
        initialValues={{
          name: profile?.name,
          surname: profile?.surname,
          phone: profile?.phone,
          pathway: profile?.pathwayId,
        }}
        // TODO: add validation schema
        onSubmit={values => updateProfile([values])}
      >
        <Form className="space-y-6">
          <Text variant="h1_light" className="mt-6">
            Personal information
          </Text>
          <TextField name="name" label="First name" />
          <TextField name="surname" label="Last name" />
          <TextField name="phone" label="Phone" />
          <Text variant="h1_light" className="mt-6">
            Pathway
          </Text>
          <TextField
            name="pathway"
            label="Pathway"
            select
            disabled={!pathwaysQuery.data}
          >
            {(pathwaysQuery.data ?? []).map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            loading={isUpdatingProfile}
            fullWidth
            type="submit"
            color="secondary"
          >
            Save information
          </Button>
        </Form>
      </Formik>
    </Container>
  )
}

Profile.pageTitle = 'Profile'

export default Profile
