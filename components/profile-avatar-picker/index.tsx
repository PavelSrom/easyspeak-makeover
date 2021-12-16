import { Avatar, IconButton } from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { useAuth } from 'contexts/auth'
import {
  useFirebaseStorage,
  useTypeSafeMutation,
  useTypeSafeQueryClient,
} from 'hooks'
import React, { useEffect, useState } from 'react'
import { Button, Text } from 'ui'
import { useSnackbar } from 'notistack'
import { useOnboarding } from 'contexts/onboarding'

export const ProfileAvatarPicker = () => {
  const [newAvatar, setNewAvatar] = useState<File>()
  const queryClient = useTypeSafeQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { profile } = useAuth()
  const { upload, uploadFile } = useFirebaseStorage()
  useOnboarding({ shown: !!profile })

  const {
    mutateAsync: uploadAvatarToProfile,
    isLoading: isUploadingAvatarToProfile,
  } = useTypeSafeMutation('updateUserProfile', {
    onSuccess: () => {
      enqueueSnackbar('Profile avatar uploaded', { variant: 'success' })
    },
    onError: err => {
      enqueueSnackbar(err.response.data.message ?? 'Cannot upload avatar', {
        variant: 'error',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries('getUserProfile')
    },
  })

  useEffect(() => {
    if (upload.url && !profile?.avatar) {
      uploadAvatarToProfile([{ avatar: upload.url }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upload.url, profile?.avatar])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    if (e.target.files[0].size > 1_048_576) {
      enqueueSnackbar('Maximum file size allowed is 1MB', { variant: 'error' })
      return
    }

    setNewAvatar(e.target.files[0])
  }

  const handleUpload = async (): Promise<void> => {
    if (!newAvatar || !profile) return

    try {
      uploadFile(newAvatar, profile.id)
    } catch (err) {
      enqueueSnackbar(upload.error, { variant: 'error' })
    }
  }

  return (
    <div className="onboarding-2">
      {profile?.avatar ? (
        <Avatar src={profile.avatar} className="w-36 h-36 mx-auto" />
      ) : (
        <div className="bg-tertiary rounded-xl p-4 text-white flex flex-col items-center">
          <label htmlFor="icon-button-file">
            <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="bg-white rounded-full">
              <IconButton size="large" color="primary" component="span">
                <PhotoCamera className="text-tertiary" />
              </IconButton>
            </div>
          </label>
          <Text>{newAvatar?.name ?? 'Choose image'}</Text>

          {!!newAvatar && (
            <Button
              loading={
                upload.status === 'pending' || isUploadingAvatarToProfile
              }
              className="mt-4"
              color="secondary"
              onClick={handleUpload}
            >
              Upload
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
