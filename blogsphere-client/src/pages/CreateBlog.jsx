import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

export default function CreateBlog() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    coverImage: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // convert tags string to array
      const payload = {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim())
      }
      await API.post("/blogs", payload)
      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Failed to create blog")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">✍️ Create a New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Blog title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Write your blog here..."
          className="w-full border p-2 rounded h-40 resize-y"
          value={form.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          className="w-full border p-2 rounded"
          value={form.tags}
          onChange={handleChange}
        />
        <input
          type="text"
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          className="w-full border p-2 rounded"
          value={form.coverImage}
          onChange={handleChange}
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Publish Blog
        </button>
      </form>
    </div>
  )
}
