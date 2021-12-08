import * as Yup from 'yup'

const YUP_MSG = {
  MAIL: 'This is not a valid email',
  REQ: 'This field is required',
  CHAR_MIN: (amount: number) => `At least ${amount} characters`,
  CHAR_MAX: (amount: number) => `At most ${amount} characters`,
} as const

export const validateBody = async <T extends {}>(
  schema: Yup.AnySchema,
  body: T
): Promise<{ isValid: boolean; msg: any[] | null }> => {
  let isValid = false
  let msg: any[] | null = null

  try {
    await schema.validate(body, { abortEarly: false })
    isValid = true
  } catch ({ errors }) {
    msg = errors as any[]
  }

  return { isValid, msg }
}

export const createNewMemberSchema = Yup.object().shape({
  email: Yup.string().email(YUP_MSG.MAIL).required(YUP_MSG.REQ),
})

export const authCheckUserSchema = Yup.object().shape({
  email: Yup.string().email(YUP_MSG.MAIL).required(YUP_MSG.REQ),
})

export const authSignupSchema = Yup.object().shape({
  name: Yup.string().required(YUP_MSG.REQ),
  surname: Yup.string().required(YUP_MSG.REQ),
  phone: Yup.string().min(8, YUP_MSG.CHAR_MIN(8)).required(YUP_MSG.REQ),
  password: Yup.string()
    .min(6, YUP_MSG.CHAR_MIN(6))
    .max(20, YUP_MSG.CHAR_MAX(20))
    .required(YUP_MSG.REQ),
  confirmPassword: Yup.ref('password'),
  pathway: Yup.string().required(YUP_MSG.REQ),
})

export const authSigninSchema = Yup.object().shape({
  email: Yup.string().email(YUP_MSG.MAIL).required(YUP_MSG.REQ),
  password: Yup.string()
    .min(6, YUP_MSG.CHAR_MIN(6))
    .max(20, YUP_MSG.CHAR_MAX(20))
    .required(YUP_MSG.REQ),
})

export const createNewPostSchema = Yup.object().shape({
  title: Yup.string().required(YUP_MSG.REQ),
  body: Yup.string().required(YUP_MSG.REQ),
})

export const createNewCommentSchema = Yup.object().shape({
  postId: Yup.string().required(YUP_MSG.REQ),
  message: Yup.string().required(YUP_MSG.REQ),
})

export const createNewMeetingSchemaPartial = Yup.object().shape({
  description: Yup.string().required(YUP_MSG.REQ),
  venue: Yup.string().required(YUP_MSG.REQ),
  numOfSpeakers: Yup.number().required(YUP_MSG.REQ),
})

export const createNewMeetingSchema = Yup.object().shape({
  description: Yup.string().required(YUP_MSG.REQ),
  venue: Yup.string().required(YUP_MSG.REQ),
  start: Yup.string().required(YUP_MSG.REQ),
  end: Yup.string().required(YUP_MSG.REQ),
  agenda: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(YUP_MSG.REQ),
      name: Yup.string().required(YUP_MSG.REQ),
    })
  ),
})
