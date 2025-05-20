import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="text-center mt-10">
      {!user ? (
        <>
          <h1 className="text-4xl font-bold mb-4">Welcome to BlogSphere ✨</h1>
          <p className="text-gray-600 mb-6">Create, share, and discover blogs in your space.</p>
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Login</Link>
          <Link to="/register" className="bg-gray-800 text-white px-4 py-2 rounded">Register</Link>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-4">Welcome back, {user.username} 👋</h1>
          <p className="text-gray-700 mb-4">Check out the latest blogs or write your own!</p>
          <Link to="/create" className="bg-green-600 text-white px-4 py-2 rounded">Create Blog</Link>
        </>
      )}
    </div>
  )
}
