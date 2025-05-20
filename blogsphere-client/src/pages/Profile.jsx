import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import API from "../services/api"
import { Link } from "react-router-dom"

export default function Profile() {
  const { user, login } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    username: user.username,
    password: "",
    newPassword: ""
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get(`/blogs/user/${user.id}`)
        setBlogs(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchBlogs()
  }, [user.id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEdit = () => {
    setEditMode(true)
    setForm({
      username: user.username,
      password: "",
      newPassword: ""
    })
  }

  const handleCancel = () => {
    setEditMode(false)
    setForm({
      username: user.username,
      password: "",
      newPassword: ""
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        username: form.username,
      }
      if (form.password && form.newPassword) {
        payload.password = form.password
        payload.newPassword = form.newPassword
      }
      const res = await API.patch("/auth/update", payload)
      login({ ...user, username: res.data.username }) // update username in context
      setEditMode(false)
      alert("Profile updated!")
    } catch (err) {
      alert("Failed to update profile")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">👤 {user.username}'s Profile</h2>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-6"><strong>Role:</strong> {user.role}</p>

      {!editMode ? (
        <button
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleEdit}
        >
          Edit Profile
        </button>
      ) : (
        <form onSubmit={handleUpdate} className="mb-6 space-y-4 max-w-sm">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              className="w-full border p-2 rounded"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Current Password</label>
            <input
              type="password"
              name="password"
              className="w-full border p-2 rounded"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter current password to change password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="w-full border p-2 rounded"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h3 className="text-2xl font-semibold mb-4">📝 Your Blogs</h3>

      {blogs.length === 0 ? (
        <p>You haven’t posted anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="border rounded shadow hover:shadow-md transition">
              <Link to={`/blogs/${blog._id}`}>
              {blog.coverImage && (
                <img src={blog.coverImage} alt={blog.title} className="h-40 w-full object-cover rounded-t" />
              )}
              <div className="p-3">
                <h4 className="text-lg font-semibold">{blog.title}</h4>
                <p className="text-sm text-gray-600 truncate">{blog.content.slice(0, 100)}...</p>
              </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
