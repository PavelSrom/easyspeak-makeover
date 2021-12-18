import HomeOutlined from '@mui/icons-material/HomeOutlined'
import HomeWorkOutlined from '@mui/icons-material/HomeWorkOutlined'
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined'
import ChatBubbleOutlineOutlined from '@mui/icons-material/ChatBubbleOutlineOutlined'
import GroupsOutlined from '@mui/icons-material/GroupsOutlined'

export const sideNavigation = [
  {
    label: 'Home',
    url: '/',
    icon: HomeOutlined,
  },
  {
    label: 'Meetings',
    url: '/meetings',
    icon: GroupsOutlined,
  },
  {
    label: 'About the club',
    url: '/club',
    icon: HomeWorkOutlined,
  },
  {
    label: 'Discussion forum',
    url: '/discussion',
    icon: ChatBubbleOutlineOutlined,
  },
  {
    label: 'Profile',
    url: '/profile',
    icon: AccountCircleOutlined,
  },
] as const
