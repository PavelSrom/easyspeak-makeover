/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx'
import {
  AppBar,
  Avatar,
  Box,
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
import { sideNavigation } from 'utils/side-navigation'
import { useRouter } from 'next/router'
import { NotificationPopper } from 'components/notification-popper'
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
  const [paddingTop, setPaddingTop] = useState<number>(56)
  const appBarRef = useRef<HTMLDivElement>(null)
  const [session] = useSession()
  const router = useRouter()
  const { profile, logout } = useAuth()
  const drawerWidth = 290

  useEffect(() => {
    setPaddingTop(appBarRef.current?.clientHeight ?? 56)
    setActiveTab(0)
  }, [tabs])

  const value: ContextProps = useMemo(
    () => ({
      tabs,
      activeTab,
      setActiveTab,
    }),
    [tabs, activeTab, setActiveTab]
  )

  const drawer = (
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
        <Button
          onClick={() => {
            setDrawerOpen(false)
            logout()
          }}
          variant="text"
          className="text-white"
        >
          Sign out
        </Button>
      </div>
    </div>
  )

  return (
    <LayoutContext.Provider value={value}>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          ref={appBarRef}
          position="fixed"
          className="rounded-b-3xl"
          sx={{
            width: { md: !!session ? `calc(100% - ${drawerWidth}px)` : '100%' },
            ml: { md: !!session ? `${drawerWidth}px` : '100%' },
          }}
        >
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
                  sx={{ mr: 2, opacity: { md: '0' } }}
                >
                  <Menu className="text-white" />
                </IconButton>
              )}
              <Text variant="h1">{pageTitle}</Text>
              {!!session && <NotificationPopper />}
            </div>
          </Toolbar>
          {tabs && (
            <div className="px-4 pb-4 flex justify-center items-center space-x-12">
              {tabs.map((tab, index) => (
                <div
                  key={tab}
                  role="button"
                  onClick={() => setActiveTab(index)}
                  className={clsx(
                    'cursor-pointer rounded-full px-2 py-1 transition-all duration-200',
                    {
                      'bg-white': activeTab === index,
                      'bg-primary': activeTab !== index,
                    }
                  )}
                >
                  <Text
                    variant="body2"
                    className={clsx('font-semibold', {
                      'text-primary': activeTab === index,
                      'text-white': activeTab !== index,
                    })}
                  >
                    {tab}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </AppBar>
        {!!session && (
          <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            aria-label="Page navigation"
          >
            <Drawer
              variant="temporary"
              open={drawerOpen}
              anchor="left"
              onClose={() => setDrawerOpen(false)}
              className={'p-4'}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box' },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              className={'p-4'}
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
        )}
        <Box
          className={clsx('h-full min-h-screen w-full md:p-4', {
            'bg-page-bg': !!session,
          })}
          style={{ paddingTop }}
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)`, sm: '100%' },
          }}
        >
          {children}
        </Box>
      </Box>
    </LayoutContext.Provider>
  )
}

export const useLayout = (): ContextProps => {
  const context = useContext(LayoutContext)
  if (!context) throw new Error('useLayout must be used within LayoutProvider')

  return context
}
