import { TextFieldName } from 'types/helpers'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined'
import PersonOutlined from '@mui/icons-material/PersonOutlined'

export const textFieldIcons: Record<TextFieldName, React.ComponentType<any>> = {
  confirmPassword: LockOutlined,
  email: EmailOutlined,
  name: PersonOutlined,
  password: LockOutlined,
  pathway: LockOutlined,
  phone: PhoneIphoneOutlined,
  surname: PersonOutlined,
}
