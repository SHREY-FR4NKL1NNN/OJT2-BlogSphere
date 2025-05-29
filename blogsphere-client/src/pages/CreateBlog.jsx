import { useState, useEffect } from "react"
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
  const [imageFile, setImageFile] = useState(null)
  const [tagSuggestions, setTagSuggestions] = useState([])
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await API.get("/blogs")
        const tags = new Set()
        res.data.forEach(blog => blog.tags.forEach(t => tags.add(t)))
        setAllTags(Array.from(tags))
      } catch {}
    }
    fetchTags()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  function getFullUrl(path) {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${path}`
  }

  const handleImageUpload = async () => {
    if (!imageFile) return ""
    const formData = new FormData()
    formData.append("image", imageFile)
    try {
      const res = await API.post("/blogs/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      return getFullUrl(res.data.url)
    } catch {
      alert("Failed to upload image")
      return ""
    }
  }

  const handleTagInput = (e) => {
    handleChange(e)
    const input = e.target.value.split(",").pop().trim().toLowerCase()
    if (!input) {
      setTagSuggestions([])
      return
    }
    setTagSuggestions(
      allTags.filter(tag => tag.toLowerCase().startsWith(input) && !form.tags.split(",").map(t => t.trim().toLowerCase()).includes(tag.toLowerCase()))
    )
  }

  const handleTagSuggestionClick = (tag) => {
    const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean)
    tagsArr[tagsArr.length - 1] = tag
    setForm({ ...form, tags: tagsArr.join(", ") + ", " })
    setTagSuggestions([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let coverImage = form.coverImage
      if (imageFile) {
        coverImage = await handleImageUpload()
      }
      const payload = {
        ...form,
        coverImage,
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">✍️ Create a New Blog</h2>
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
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          className="w-full border p-2 rounded"
          value={form.coverImage}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {form.coverImage && (
          <img src={getFullUrl(form.coverImage)} alt="cover" className="w-full h-40 object-cover rounded" />
        )}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          className="w-full border p-2 rounded"
          value={form.tags}
          onChange={handleTagInput}
        />
        {tagSuggestions.length > 0 && (
          <div className="bg-white border rounded shadow p-2 mt-1 flex flex-wrap gap-2">
            {tagSuggestions.map(tag => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded cursor-pointer"
                onClick={() => handleTagSuggestionClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Publish Blog
        </button>
      </form>
    </div>
  )
}
