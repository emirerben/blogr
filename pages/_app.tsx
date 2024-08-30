import React, { ReactNode, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import LandingPage from '../components/LandingPage'
import '../styles/globals.css'

interface AuthProps {
  children: ReactNode;
}

// Extend the Session type to include username
import { Session } from "next-auth"
interface CustomSession extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  }
}

function Auth({ children }: AuthProps) {
  const router = useRouter()
  const { data: session, status } = useSession() as { data: CustomSession | null, status: "loading" | "authenticated" | "unauthenticated" }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    
    if (!session) {
      setLoading(false) // Set loading to false when there's no session
    } else if (!session.user?.username && router.pathname !== '/set-username') {
      router.push('/set-username')
    } else {
      setLoading(false) // Set loading to false when everything is ready
    }
  }, [session, status, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <LandingPage />
  }

  if (!session.user?.username && router.pathname !== '/set-username') {
    return <div>Redirecting to set username...</div>
  }

  return <>{children}</>
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </SessionProvider>
  )
}

export default MyApp