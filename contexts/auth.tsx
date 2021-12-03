import {
  useTypeSafeMutation,
  useTypeSafeQuery,
  useTypeSafeQueryClient,
} from 'hooks'
import { signOut, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { ProfileDTO } from 'types/api'
import { CreateMemberPayload } from 'types/payloads'

type ContextProps = {
  userId: string | undefined
  profile: ProfileDTO | undefined
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
  const [session] = useSession()
  const router = useRouter()

  const { data: profile } = useTypeSafeQuery('getUserProfile', {
    enabled: !!session,
  })

  const { mutateAsync: checkEmail } = useTypeSafeMutation('authCheckUser')
  const { mutateAsync: memberSignup } = useTypeSafeMutation('authSignup')
  const { mutateAsync: deleteUser } = useTypeSafeMutation('deleteUserAccount')

  const checkMemberEmail = useCallback(async (email: string): Promise<void> => {
    try {
      const { id } = await checkEmail([email])
      setUserId(id)
      enqueueSnackbar('Email verified, please sign up', { variant: 'success' })
    } catch (error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message ?? 'Cannot fetch user data', {
        variant: 'error',
      })
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
      profile,
      checkMemberEmail,
      signUp,
      logout,
      deleteAccount,
    }),
    [userId, profile, checkMemberEmail, signUp, logout, deleteAccount]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): ContextProps => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')

  return context
}
