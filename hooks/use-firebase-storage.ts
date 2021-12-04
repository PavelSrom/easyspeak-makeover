import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from '@firebase/storage'
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { useState } from 'react'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const firebaseStorage = getStorage(initializeApp(firebaseConfig))

type Status = 'idle' | 'pending' | 'success' | 'error'

type UploadState = {
  status: Status
  error: string | undefined
  url: string | undefined
}

export const useFirebaseStorage = () => {
  const [upload, setUpload] = useState<UploadState>({
    status: 'idle',
    error: undefined,
    url: undefined,
  })

  const uploadFile = (file: File, fileName: string) => {
    const storageRef = ref(firebaseStorage, fileName)
    const fileUpload = uploadBytesResumable(storageRef, file)

    fileUpload.on(
      'state_changed',
      () => {
        setUpload(prev => ({ ...prev, status: 'pending' }))
      },
      err => {
        setUpload(prev => ({ ...prev, status: 'error', error: err.message }))
      },
      async () => {
        const url = await getDownloadURL(fileUpload.snapshot.ref)

        setUpload(prev => ({ ...prev, status: 'success', url }))
      }
    )
  }

  // TODO
  const deleteFile = async (url: string) => {
    const storageRef = ref(firebaseStorage, url)

    deleteObject(storageRef)
      .then(() => {})
      .catch(() => {})
  }

  return { upload, uploadFile, deleteFile }
}
