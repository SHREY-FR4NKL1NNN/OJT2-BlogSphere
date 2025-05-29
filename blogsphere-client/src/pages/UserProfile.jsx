import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function UserProfile() {
  const { userId } = useParams()
  const { user } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const res = await API.get(`/auth/user/${userId}`)
        setProfileUser(res.data)
      } catch {
        setProfileUser(null)
      }
    }
    const fetchBlogs = async () => {
      try {
        const res = await API.get(`/blogs/user/${userId}`)
        setBlogs(res.data)
      } catch {
        setBlogs([])
      }
    }
    const fetchFollowing = async () => {
      try {
        const res = await API.get("/auth/following")
        setIsFollowing(res.data.some(f => f._id === userId))
      } catch {
        setIsFollowing(false)
      }
    }
    setLoading(true)
    fetchProfileUser()
    fetchBlogs()
    if (user) fetchFollowing()
    setLoading(false)
    // eslint-disable-next-line
  }, [userId, user])

  const handleFollow = async () => {
    try {
      await API.post(`/auth/follow/${userId}`)
      setIsFollowing(true)
    } catch {
      alert("Failed to follow user")
    }
  }

  const handleUnfollow = async () => {
    try {
      await API.post(`/auth/unfollow/${userId}`)
      setIsFollowing(false)
    } catch {
      alert("Failed to unfollow user")
    }
  }

  if (loading) return <div className="mt-10 text-center">Loading...</div>
  if (!profileUser) return <div className="mt-10 text-center">User not found.</div>

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">
        👤 {profileUser.username}'s Profile
      </h2>
      <p className="mb-2"><strong>Email:</strong> {profileUser.email}</p>
      <p className="mb-6"><strong>Role:</strong> {profileUser.role}</p>
      {user && user.id !== userId && (
        <div className="mb-6">
          {isFollowing ? (
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={handleUnfollow}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleFollow}
            >
              Follow
            </button>
          )}
        </div>
      )}
      <h3 className="text-2xl font-semibold mb-4">📝 Blogs</h3>
      {blogs.length === 0 ? (
        <p>No blogs yet.</p>
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
