import { TextFieldName } from 'types/helpers'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import Title from '@mui/icons-material/Title'
import Message from '@mui/icons-material/Message'
import Timeline from '@mui/icons-material/Timeline'

export const textFieldIcons: Record<TextFieldName, React.ComponentType<any>> = {
  body: Title,
  confirmPassword: LockOutlined,
  email: EmailOutlined,
  message: Message,
  name: PersonOutlined,
  password: LockOutlined,
  pathway: Timeline,
  phone: PhoneIphoneOutlined,
  surname: PersonOutlined,
  title: Title,
}
