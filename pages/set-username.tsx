import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

const SetUsername = () => {
  const [username, setUsername] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/set-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, userId: session.user.id }),
    })
    if (response.ok) {
      router.push('/create')
    }
  }

  return (
    <Layout>
      <h1>Choose your username</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <button type="submit">Set Username</button>
      </form>
    </Layout>
  )
}

export default SetUsername