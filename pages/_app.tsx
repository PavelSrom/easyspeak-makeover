import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { QueryClientProvider } from 'react-query'
import { queryClient } from 'utils/query-client'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { createEmotionCache } from 'utils/create-emotion-cache'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { theme } from 'styles/theme'
import { Provider } from 'next-auth/client'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from 'contexts/auth'

type CustomAppProps = AppProps & {
  emotionCache: EmotionCache
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: CustomAppProps) => (
  <CacheProvider value={emotionCache}>
    <Head>
      <title>EasySpeak</title>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <Provider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <SnackbarProvider
              dense
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <AuthProvider>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
              </AuthProvider>
            </SnackbarProvider>
          </StyledEngineProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </CacheProvider>
)

export default MyApp
