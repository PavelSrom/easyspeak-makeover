import { TextFieldName } from 'types/helpers'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import Title from '@mui/icons-material/Title'
import Message from '@mui/icons-material/Message'
import Timeline from '@mui/icons-material/Timeline'
import Groups from '@mui/icons-material/Groups'
import ShortText from '@mui/icons-material/ShortText'
import LocationOn from '@mui/icons-material/LocationOn'
import AccessTime from '@mui/icons-material/AccessTime'
import ChatBubble from '@mui/icons-material/ChatBubble'

export const textFieldIcons: Record<TextFieldName, React.ComponentType<any>> = {
  body: Title,
  clubRole: Groups,
  confirmPassword: LockOutlined,
  description: ShortText,
  email: EmailOutlined,
  end: AccessTime,
  memberId: PersonOutlined,
  message: Message,
  name: PersonOutlined,
  numOfSpeakers: ChatBubble,
  password: LockOutlined,
  pathway: Timeline,
  phone: PhoneIphoneOutlined,
  start: AccessTime,
  surname: PersonOutlined,
  title: Title,
  venue: LocationOn,
}
