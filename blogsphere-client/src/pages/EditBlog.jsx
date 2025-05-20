import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../services/api"

export default function EditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    coverImage: ""
  })

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await API.get(`/blogs/${id}`)
      const blog = res.data
      setForm({
        title: blog.title,
        content: blog.content,
        tags: blog.tags.join(", "),
        coverImage: blog.coverImage || ""
      })
    }
    fetchBlog()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.put(`/blogs/${id}`, {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim())
      })
      navigate(`/blogs/${id}`)
    } catch (err) {
      console.error(err)
      alert("Failed to update blog")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">✏️ Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" className="w-full border p-2 rounded" value={form.title} onChange={handleChange} />
        <textarea name="content" className="w-full border p-2 rounded h-40 resize-y" value={form.content} onChange={handleChange} />
        <input type="text" name="tags" className="w-full border p-2 rounded" value={form.tags} onChange={handleChange} />
        <input type="text" name="coverImage" className="w-full border p-2 rounded" value={form.coverImage} onChange={handleChange} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Blog</button>
      </form>
    </div>
  )
}
