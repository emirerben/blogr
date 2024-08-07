import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import '../styles/globals.css'

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
  )
}

export default App