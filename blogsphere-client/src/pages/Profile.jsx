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
  const [following, setFollowing] = useState([])
  const [avatar, setAvatar] = useState(user.avatar ? getFullUrl(user.avatar) : "")
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get(`/blogs/user/${user.id}`)
        setBlogs(res.data)
      } catch (err) {
        setBlogs([])
      }
    }
    const fetchFollowing = async () => {
      try {
        const res = await API.get("/auth/following")
        setFollowing(res.data)
      } catch {}
    }
    fetchBlogs()
    fetchFollowing()
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

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0])
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    const formData = new FormData()
    formData.append("avatar", avatarFile)
    try {
      const res = await API.post("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      const avatarUrl = getFullUrl(res.data.avatar)
      setAvatar(avatarUrl)
      login({ ...user, avatar: avatarUrl })
      alert("Avatar updated!")
    } catch {
      alert("Failed to upload avatar")
    }
  }

  function getFullUrl(path) {
    if (!path) return ""
    if (path.startsWith("http")) return path
    // Adjust the base URL if needed
    return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${path}`
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">
        👤 {user.username}'s Profile
      </h2>
      <div className="mb-4 flex items-center gap-4">
        {avatar && (
          <img src={avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
        )}
        <div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <button
            className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handleAvatarUpload}
            type="button"
            disabled={!avatarFile}
          >
            Upload Avatar
          </button>
        </div>
      </div>
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

      <h3 className="text-2xl font-semibold mb-4">👥 Following</h3>
      <ul className="mb-6">
        {following.length === 0 ? (
          <li>You are not following anyone yet.</li>
        ) : (
          following.map(f => (
            <li key={f._id}>
              <Link to={`/user/${f._id}`} className="text-blue-600 hover:underline">{f.username}</Link>
            </li>
          ))
        )}
      </ul>

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
