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
  const [imageFile, setImageFile] = useState(null)
  const [tagSuggestions, setTagSuggestions] = useState([])
  const [allTags, setAllTags] = useState([])

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
      await API.put(`/blogs/${id}`, {
        ...form,
        coverImage,
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
        <input type="text" name="coverImage" className="w-full border p-2 rounded" value={form.coverImage} onChange={handleChange} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Blog</button>
      </form>
    </div>
  )
}
