import React, { useState } from "react"
import Layout from "../../components/Layout"
import { useRouter } from "next/router"

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const router = useRouter()
  const { username } = router.query

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implement post creation logic here
    // After successful creation, redirect to the new post
    const slug = title.toLowerCase().replace(/ /g, '-')
    router.push(`/${username}/${slug}`)
  }

  return (
    <Layout>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button type="submit">Create Post</button>
      </form>
    </Layout>
  )
}

export default CreatePost