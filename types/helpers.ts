import { EmotionCache } from '@emotion/react'
import { NextComponentType, NextPage, NextPageContext } from 'next'
import { Session } from 'next-auth'
import { AppProps } from 'next/app'

export type Unpromisify<T> = T extends Promise<infer U> ? U : T

export type ApiResponse<T> = T extends Promise<infer U>
  ? U extends void
    ? never
    : U
  : never

export type ErrorResponse = {
  response: {
    data: {
      msg: string
    }
  }
}

export type ApiSession = Session & {
  user: {
    userId: string
    clubId: string
    profileId?: string
  }
}

type PageOptions = {
  pageTitle: string
  tabs?: string[]
}

export type CustomAppProps<P = {}> = Omit<
  AppProps,
  'pageProps' | 'Component'
> & {
  emotionCache: EmotionCache
  Component: NextComponentType<NextPageContext, any, P> & PageOptions
  pageProps: {
    session?: ApiSession
  }
}

export type CustomNextPage = NextPage & PageOptions

export type TextFieldName =
  | 'confirmPassword'
  | 'email'
  | 'name'
  | 'password'
  | 'pathway'
  | 'phone'
  | 'surname'
