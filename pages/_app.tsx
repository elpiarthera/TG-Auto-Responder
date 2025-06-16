import '../styles/globals.css'
import '../styles/components.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider } from '@/lib/context/AppContext'
import { ThemeProvider } from '@/lib/hooks/useTheme'
import { ClerkProvider } from "@clerk/nextjs";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider>
        <AppProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </AppProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export default MyApp
