import clsx from 'clsx'
import {
  AppBar,
  Avatar,
  Badge,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
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
import { Button, Text } from 'ui'
import { useSession } from 'next-auth/client'
import { useTypeSafeQuery } from 'hooks'
import { sideNavigation } from 'utils/side-navigation'
import { useRouter } from 'next/router'
import { useAuth } from './auth'

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
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [marginTop, setMarginTop] = useState<number>(56)
  const appBarRef = useRef<HTMLDivElement>(null)
  const [session] = useSession()
  const router = useRouter()
  const { profile, logout } = useAuth()

  const { data: notifications } = useTypeSafeQuery('getAllNotifications')

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
              'justify-between': !!session,
              'justify-center': !session,
            })}
          >
            {!!session && (
              <IconButton
                size="small"
                edge="start"
                onClick={() => setDrawerOpen(true)}
              >
                <Menu className="text-white" />
              </IconButton>
            )}
            <Text variant="h1">{pageTitle}</Text>
            {!!session && (
              <Badge
                color="secondary"
                showZero={false}
                badgeContent={notifications?.length ?? 0}
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

      <Drawer
        open={drawerOpen}
        anchor="left"
        onClose={() => setDrawerOpen(false)}
        className="p-4"
      >
        <div className="p-4 bg-primary h-full flex flex-col">
          <div className="flex">
            <Avatar src={profile?.avatar ?? ''} className="w-16 h-16" />
            <div className="pl-4">
              <Text
                variant="h2"
                className="text-white"
              >{`${profile?.name} ${profile?.surname}`}</Text>
              <Text variant="body2" className="mt-2 text-white">
                {profile?.User.Club.name}
              </Text>
            </div>
          </div>

          <Divider className="my-4 bg-tertiary" />

          <List>
            {sideNavigation.map(({ label, url, icon: Icon }) => (
              <ListItem
                key={url}
                disablePadding
                className={clsx('rounded-xl overflow-hidden', {
                  'bg-tertiary':
                    url === '/'
                      ? router.pathname === '/'
                      : router.pathname.startsWith(url),
                })}
              >
                <ListItemButton
                  onClick={() => {
                    router.push(url)
                    setDrawerOpen(false)
                  }}
                >
                  <ListItemIcon>
                    <Icon className="text-white" />
                  </ListItemIcon>
                  <ListItemText primary={label} className="text-white" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <div className="mt-auto">
            <Button onClick={logout} variant="text" className="text-white">
              Sign out
            </Button>
          </div>
        </div>
      </Drawer>

      <main style={{ marginTop }}>{children}</main>
    </LayoutContext.Provider>
  )
}

export const useLayout = (): ContextProps => {
  const context = useContext(LayoutContext)
  if (!context) throw new Error('useLayout must be used within LayoutProvider')

  return context
}
