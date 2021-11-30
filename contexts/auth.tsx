import { useTypeSafeMutation, useTypeSafeQueryClient } from 'hooks'
import { signOut } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { CreateMemberPayload } from 'types/payloads'

type ContextProps = {
  userId: string | undefined
  checkMemberEmail: (email: string) => Promise<void>
  signUp: (payload: CreateMemberPayload) => Promise<void>
  logout: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [userId, setUserId] = useState<string>()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useTypeSafeQueryClient()
  const router = useRouter()

  const { mutateAsync: checkEmail } = useTypeSafeMutation('authCheckUser')
  const { mutateAsync: memberSignup } = useTypeSafeMutation('authSignup')
  const { mutateAsync: deleteUser } = useTypeSafeMutation('deleteUserAccount')

  const checkMemberEmail = useCallback(async (email: string): Promise<void> => {
    try {
      const { id } = await checkEmail([email])
      setUserId(id)
      enqueueSnackbar('Email verified, please sign up', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Cannot fetch user data', { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signUp = useCallback(
    async (payload: CreateMemberPayload): Promise<void> => {
      try {
        await memberSignup([payload])
        enqueueSnackbar('Signup successful, please sign in', {
          variant: 'success',
        })
        router.push('/signin')
      } catch (error) {
        enqueueSnackbar('Cannot register new member', { variant: 'error' })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const logout = useCallback(async (): Promise<void> => {
    await signOut()
    queryClient.clear()
    setUserId(undefined)
    router.push('/signin')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteAccount = useCallback(async (): Promise<void> => {
    try {
      await deleteUser([])
      enqueueSnackbar('Account deleted', { variant: 'success' })
      logout()
    } catch (err) {
      enqueueSnackbar('Cannot delete user profile', { variant: 'error' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value: ContextProps = useMemo(
    () => ({
      userId,
      checkMemberEmail,
      signUp,
      logout,
      deleteAccount,
    }),
    [userId, checkMemberEmail, signUp, logout, deleteAccount]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): ContextProps => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')

  return context
}
