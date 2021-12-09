import {
  Avatar,
  Container,
  Divider,
  Fab,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import AddOutlined from '@mui/icons-material/AddOutlined'
import Delete from '@mui/icons-material/Delete'
import { Form, Formik } from 'formik'
import { useTypeSafeMutation, useTypeSafeQuery } from 'hooks'
import { useRouter } from 'next/router'
import { Fragment, useMemo, useState } from 'react'
import { CustomNextPage } from 'types/helpers'
import { Button, Text, TextField, TimePicker } from 'ui'
import { useSnackbar } from 'notistack'
import { CreateMeetingPayload } from 'types/payloads'
import {
  createNewMeetingSchema,
  createNewMeetingSchemaPartial,
  validateBody,
} from 'utils/payload-validations'

const AddMeeting: CustomNextPage = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [helperRoles, setHelperRoles] = useState<
    { id: string; name: string }[]
  >([])
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

  const meetingRolesQuery = useTypeSafeQuery('getMeetingRoles', {
    staleTime: Infinity,
  })

  const { mutateAsync: createNewMeeting, isLoading: isCreatingMeeting } =
    useTypeSafeMutation('createNewMeeting', {
      onSuccess: () => {
        enqueueSnackbar('Meeting created', { variant: 'success' })
        router.replace('/meetings')
      },
      onError: err => {
        enqueueSnackbar(err.response.data.message ?? 'Cannot create meeting', {
          variant: 'error',
        })
      },
      onSettled: () => {},
    })

  const allHelperRoles = useMemo(
    () =>
      (meetingRolesQuery.data ?? []).filter(role => {
        const lowercaseRole = role.name.toLowerCase()

        const isNotAttendance = !lowercaseRole.includes('coming')
        const isNotSpeaker = !lowercaseRole.startsWith('speak')
        const isNotEvaluator = !lowercaseRole.startsWith('eval')

        return isNotAttendance && isNotSpeaker && isNotEvaluator
      }),
    [meetingRolesQuery.data]
  )

  const speakersSorted = useMemo(
    () =>
      (meetingRolesQuery.data ?? [])
        .filter(role => role.name.toLowerCase().startsWith('speaker'))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [meetingRolesQuery.data]
  )

  const initialValues = {
    description: '',
    venue: '',
    start: new Date((router.query.day as string) ?? ''),
    end: new Date((router.query.day as string) ?? ''),
    numOfSpeakers: 3,
  }

  const handleSubmit = async ({
    numOfSpeakers,
    ...values
  }: typeof initialValues): Promise<void> => {
    if (new Date(values.start).getTime() > new Date(values.end).getTime()) {
      enqueueSnackbar('End time must be later than start time', {
        variant: 'error',
      })
      return
    }

    const payload: CreateMeetingPayload = {
      ...values,
      start: values.start.toISOString(),
      end: values.end.toISOString(),
      agenda: [],
    }
    // merge assigned speakers with helper roles into the 'agenda' prop
    payload.agenda = [...helperRoles].concat(
      speakersSorted.slice(0, numOfSpeakers)
    )

    const { isValid } = await validateBody(createNewMeetingSchema, payload)
    if (!isValid) {
      enqueueSnackbar('Form is not valid', { variant: 'error' })
      return
    }

    createNewMeeting([payload])
  }

  return (
    <Container className="py-4">
      <Formik
        initialValues={initialValues}
        validationSchema={createNewMeetingSchemaPartial}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="space-y-4">
              <Text variant="h1_light">Meeting details</Text>
              <TextField name="description" label="Description" />
              <TextField name="venue" label="Location" />

              <div className="flex justify-between space-x-4">
                <TimePicker
                  label="Start time"
                  value={values.start}
                  onChange={newValue => setFieldValue('start', newValue)}
                />
                <TimePicker
                  label="End time"
                  value={values.end}
                  onChange={newValue => setFieldValue('end', newValue)}
                />
              </div>
            </div>

            <Text variant="h1_light" className="mt-8 mb-4">
              Agenda
            </Text>
            <TextField
              name="numOfSpeakers"
              label="Number of speakers and evaluators"
              select
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </TextField>

            <div className="mt-4">
              {allHelperRoles.length !== helperRoles.length && (
                <>
                  <div className="flex items-center">
                    <Fab
                      color="secondary"
                      size="small"
                      className="mr-4"
                      onClick={e => setAnchorEl(e.currentTarget)}
                    >
                      <AddOutlined className="text-white" />
                    </Fab>
                    <Text variant="h4">Add role</Text>

                    <Menu
                      open={!!anchorEl}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                    >
                      {allHelperRoles.map(role => (
                        <MenuItem
                          key={role.id}
                          disabled={helperRoles.some(r => r.id === role.id)}
                          onClick={() =>
                            setHelperRoles(prev => [...prev, role])
                          }
                        >
                          {role.name}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                  <Divider className="my-4" />
                </>
              )}
            </div>

            {helperRoles.map(role => (
              <Fragment key={role.id}>
                <div className="flex items-center">
                  <Avatar src="" className="w-10 h-10 mr-4" />
                  <Text variant="h4">{role.name}</Text>
                  <IconButton
                    edge="end"
                    className="ml-auto"
                    onClick={() => {
                      setAnchorEl(null)
                      setHelperRoles(prev => prev.filter(r => r.id !== role.id))
                    }}
                  >
                    <Delete />
                  </IconButton>
                </div>
                <Divider className="my-4" />
              </Fragment>
            ))}

            <Button
              loading={isCreatingMeeting}
              type="submit"
              color="secondary"
              fullWidth
            >
              Create meeting
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

AddMeeting.pageTitle = 'Add meeting'

export default AddMeeting
