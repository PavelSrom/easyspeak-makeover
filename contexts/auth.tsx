import { useTypeSafeQueryClient } from 'hooks'
import { signOut } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { createContext, useContext, useState, useMemo } from 'react'

type ContextProps = {
  profile: UserDTO | null
  getUser: () => Promise<void>
  logout: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState<UserDTO | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useTypeSafeQueryClient()
  const router = useRouter()

  const checkMemberEmail = async (): Promise<void> => {
    try {
      const userData = await getUserProfile()
      setUser(userData)
    } catch (error) {
      enqueueSnackbar('Cannot fetch user data', { variant: 'error' })
    }
  }

  const logout = async (): Promise<void> => {
    await signOut()
    queryClient.clear()
    setUser(null)
    router.push('/signin')
  }

  const deleteAccount = async (): Promise<void> => {
    try {
      await deleteUser()
      enqueueSnackbar('Account deleted', { variant: 'success' })
      logout()
    } catch (err) {
      enqueueSnackbar('Cannot delete user profile', { variant: 'error' })
    }
  }

  const value: ContextProps = useMemo(
    () => ({
      user,
      getUser,
      logout,
      deleteAccount,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): ContextProps => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')

  return context
}
