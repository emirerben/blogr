import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from '../styles/SetUsername.module.css'

const SetUsername = () => {
  const [username, setUsername] = useState('')
  const { data: session, update } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session?.user?.email) {
      console.error('No user email in session')
      return
    }

    try {
      console.log('Submitting username:', username)
      const response = await fetch('/api/set-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, userEmail: session.user.email }),
      })
      if (response.ok) {
        console.log('Username set successfully')
        await update({ username: username })
        router.push('/')
      } else {
        const data = await response.json()
        console.error('Failed to set username:', data.message)
        alert(`Failed to set username: ${data.message}`)
      }
    } catch (error) {
      console.error('Error setting username:', error)
      alert('An error occurred while setting the username. Please try again.')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Choose your username</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Set Username</button>
      </form>
    </div>
  )
}

export default SetUsername