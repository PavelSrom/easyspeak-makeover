import clsx from 'clsx'
import { AppBar, Badge, Chip, IconButton, Toolbar } from '@mui/material'
import Menu from '@mui/icons-material/Menu'
import Notifications from '@mui/icons-material/Notifications'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { Text } from 'ui'

type ContextProps = {
  tabs: string[]
  activeTab: number
  setActiveTab: Dispatch<SetStateAction<number>>
}

const LayoutContext = createContext<ContextProps>({} as ContextProps)

type Props = {
  pageTitle: string
  children: React.ReactNode
  tabs?: string[]
}

export const LayoutProvider = ({ pageTitle, children, tabs = [] }: Props) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [marginTop, setMarginTop] = useState<number>(56)
  const appBarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const isPageWithoutAuthRequired = ['/signup', '/signin'].includes(
    router.pathname
  )

  useEffect(() => {
    setMarginTop(appBarRef.current?.clientHeight ?? 56)
  }, [tabs])

  const value: ContextProps = useMemo(
    () => ({
      tabs,
      activeTab,
      setActiveTab,
    }),
    [tabs, activeTab, setActiveTab]
  )

  return (
    <LayoutContext.Provider value={value}>
      <AppBar ref={appBarRef} position="fixed" className="rounded-b-3xl">
        <Toolbar>
          <div
            className={clsx('w-full flex items-center text-white', {
              'justify-center': isPageWithoutAuthRequired,
              'justify-between': !isPageWithoutAuthRequired,
            })}
          >
            {!isPageWithoutAuthRequired && (
              <IconButton size="small" edge="start">
                <Menu className="text-white" />
              </IconButton>
            )}
            <Text variant="h1">{pageTitle}</Text>
            {!isPageWithoutAuthRequired && (
              <Badge
                color="secondary"
                badgeContent={420}
                classes={{ badge: 'text-white' }}
              >
                <IconButton size="small" edge="end">
                  <Notifications className="text-white" />
                </IconButton>
              </Badge>
            )}
          </div>
        </Toolbar>
        {tabs && (
          <div className="px-4 pb-4 flex justify-center items-center space-x-12">
            {tabs.map((tab, index) => (
              <Chip
                key={tab}
                label={tab}
                color="primary"
                variant={activeTab === index ? 'outlined' : 'filled'}
                className={clsx('cursor-pointer', {
                  'bg-white': activeTab === index,
                })}
              />
            ))}
          </div>
        )}
      </AppBar>

      <main style={{ marginTop }}>{children}</main>
    </LayoutContext.Provider>
  )
}

export const useLayout = (): ContextProps => {
  const context = useContext(LayoutContext)
  if (!context) throw new Error('useLayout must be used within LayoutProvider')

  return context
}
