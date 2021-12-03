import '../styles/globals.css'
import Head from 'next/head'
import { QueryClientProvider } from 'react-query'
import { queryClient } from 'utils/query-client'
import { CacheProvider } from '@emotion/react'
import { createEmotionCache } from 'utils/create-emotion-cache'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { theme } from 'styles/theme'
import { Provider as NextAuthProvider } from 'next-auth/client'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from 'contexts/auth'
import { LayoutProvider } from 'contexts/page-layout'
import { CustomAppProps } from 'types/helpers'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const MyApp = ({
  Component,
  pageProps: { session, ...otherPageProps },
  emotionCache = clientSideEmotionCache,
}: CustomAppProps) => (
  <CacheProvider value={emotionCache}>
    <Head>
      <title>EasySpeak</title>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <NextAuthProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <StyledEngineProvider injectFirst>
            <SnackbarProvider
              dense
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <AuthProvider>
                <LayoutProvider
                  pageTitle={Component.pageTitle}
                  tabs={Component.tabs}
                >
                  {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                  <CssBaseline />
                  <Component {...otherPageProps} />
                </LayoutProvider>
              </AuthProvider>
            </SnackbarProvider>
          </StyledEngineProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </NextAuthProvider>
  </CacheProvider>
)

export default MyApp
