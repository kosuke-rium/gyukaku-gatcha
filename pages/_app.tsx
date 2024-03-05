import type { AppProps } from 'next/app'
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../theme';
import createEmotionCache from '../createEmotionCache';
import { QueryClient, QueryClientProvider } from 'react-query'
import { supabase } from '../utils/supabase'
import { useEffect } from 'react'
import { useRouter } from 'next/router' 

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // fetachに失敗した場合に再フェッチをするかどうか
      refetchOnWindowFocus: false, // ブラウザにフォーカスをした際に再度fetchするかどうか(便利！！)
    },
  },
})

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { push, pathname } = useRouter()
  const validateSession = async () => {
    const user = supabase.auth.user() // これで現在ログインしているユーザの情報を取得可能
    if (user && pathname === ('/login' || '/signup')) {
      push('/')
    } else if (!user && pathname !== ('/login' || '/signup')) {
      await push('/login')
    }
  }
  supabase.auth.onAuthStateChange((event, _) => { // onAuthStateChangeはユーザの状態の変化を検知してくれる
    if (event === 'SIGNED_IN' && pathname === ('/login' || '/signup')) { // SIGNED_INはログインまたはユーザの新規作成
      push('/')
    }
    if (event === 'SIGNED_OUT') {
      push('/login')
    }
  })
  useEffect(() => {
    validateSession()
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  )
}

export default MyApp
