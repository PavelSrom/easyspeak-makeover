import { TextFieldName } from 'types/helpers'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'
import Title from '@mui/icons-material/Title'

export const textFieldIcons: Record<TextFieldName, React.ComponentType<any>> = {
  body: Title,
  confirmPassword: LockOutlined,
  email: EmailOutlined,
  name: PersonOutlined,
  password: LockOutlined,
  pathway: LockOutlined,
  phone: PhoneIphoneOutlined,
  surname: PersonOutlined,
  title: Title,
}
