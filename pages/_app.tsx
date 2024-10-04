import '../styles/globals.css'
import '../styles/components.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider } from '@/lib/context/AppContext'
import { ThemeProvider } from '@/lib/hooks/useTheme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AppProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </AppProvider>
    </ThemeProvider>
  )
}

export default MyApp
