import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import API from "../services/api"
import { Link } from "react-router-dom"

export default function Profile() {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])

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

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">👤 {user.username}'s Profile</h2>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-6"><strong>Role:</strong> {user.role}</p>

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
